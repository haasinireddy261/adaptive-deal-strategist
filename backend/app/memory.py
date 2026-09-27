import os
import re
import time
import json
import socket
import logging
import threading
from typing import List, Optional, Tuple
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

import httpx
from hindsight_client import Hindsight
from hindsight import HindsightServer

from .config import settings
from .schemas import MemoryItem, DealMemoriesResponse

logger = logging.getLogger("deal_intelligence.memory")

class ThreadedLocalServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

# Fallback LLM server for Hindsight when no external Groq key is active
class LocalExtractionHandler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

    def do_GET(self):
        # Support /v1/models or health checks from OpenAI client
        response_data = {
            "object": "list",
            "data": [
                {"id": "llama-3.3-70b-versatile", "object": "model", "owned_by": "local-bridge"}
            ]
        }
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        try:
            self.wfile.write(json.dumps(response_data).encode("utf-8"))
        except (BrokenPipeError, ConnectionResetError, OSError):
            pass

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
        except Exception:
            body = ""
        
        extracted_what = ""
        try:
            parsed = json.loads(body)
            messages = parsed.get("messages", [])
            for m in messages:
                if m.get("role") == "user":
                    content = m.get("content", "")
                    
                    # Regex search specifically for tagged interaction lines: [FACT], [OUTCOME], [STRATEGY]
                    match = re.search(r"(\[(?:FACT|OUTCOME|STRATEGY)\][^\n\r]+)", content, re.IGNORECASE)
                    if match:
                        extracted_what = match.group(1).strip()
                        break
                    
                    # If untagged, inspect non-metadata lines from bottom to top
                    lines = [line.strip() for line in content.splitlines() if line.strip()]
                    for line in reversed(lines):
                        lower_line = line.lower()
                        if any(bad in lower_line for bad in ["chunk:", "event date:", "extract facts", "return valid", "json only", "following chunk"]):
                            continue
                        extracted_what = line
                        break
        except Exception:
            pass

        # Strict safety check: Never leak internal prompts into memories
        if not extracted_what or any(bad in extracted_what.lower() for bad in ["return valid", "extract facts", "chunk:", "event date:"]):
            extracted_what = "[FACT] Customer interaction details recorded"

        response_data = {
            "id": "chatcmpl-local-bridge",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": "llama-3.3-70b-versatile",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": json.dumps({
                            "facts": [
                                {
                                    "what": extracted_what,
                                    "who": "Key Stakeholder",
                                    "where": None,
                                    "when": "interaction",
                                    "why": "Deal progression context",
                                    "fact_kind": "deal_intelligence",
                                    "fact_type": "world",
                                    "entities": ["Deal", "Customer"],
                                    "occurred_start": None,
                                    "occurred_end": None,
                                    "causal_relations": []
                                }
                            ]
                        })
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 80,
                "completion_tokens": 40,
                "total_tokens": 120
            }
        }
        
        try:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode("utf-8"))
        except (BrokenPipeError, ConnectionResetError, OSError):
            pass

    def log_message(self, format, *args):
        pass

class HindsightManager:
    """
    Manages the lifecycle of the Hindsight memory engine and provides
    clean async retain/recall operations via the official hindsight-client.
    Thread-safe reentrant singleton initialization.
    """
    def __init__(self):
        self._server: Optional[HindsightServer] = None
        self._mock_server: Optional[ThreadedLocalServer] = None
        self._client: Optional[Hindsight] = None
        self._base_url: str = settings.HINDSIGHT_BASE_URL
        self._is_ready: bool = False
        self._init_lock = threading.Lock()

    def initialize(self):
        """Start or connect to the Hindsight server (thread-safe singleton)."""
        if self._is_ready:
            return

        with self._init_lock:
            if self._is_ready:
                return

            # 1. First probe if Hindsight is already running on port 8899
            try:
                resp = httpx.get(f"{self._base_url}/health", timeout=2.0)
                if resp.status_code == 200:
                    logger.info(f"Connected to existing Hindsight server at {self._base_url}")
                    self._client = Hindsight(base_url=self._base_url)
                    self._is_ready = True
                    return
            except Exception:
                pass

            # 2. Start embedded HindsightServer if not already reachable
            logger.info(f"Starting native HindsightServer on port {settings.HINDSIGHT_PORT}...")
            groq_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
            has_real_groq = bool(groq_key and groq_key.startswith("gsk_"))

            # If embedded Postgres is already listening on 5432, connect directly to it
            # to avoid pg0 re-initialization conflicts on Windows
            db_target = "pg0"
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.settimeout(0.5)
                    if s.connect_ex(("127.0.0.1", 5432)) == 0:
                        db_target = "postgresql://hindsight:hindsight@127.0.0.1:5432/hindsight"
            except Exception:
                pass

            if has_real_groq:
                logger.info("Configuring HindsightServer with Groq LLM provider")
                self._server = HindsightServer(
                    db_url=db_target,
                    llm_provider="groq",
                    llm_api_key=groq_key,
                    llm_model="llama-3.3-70b-versatile",
                    port=settings.HINDSIGHT_PORT,
                    log_level="warning"
                )
            else:
                logger.info("Configuring HindsightServer with local LLM bridge")
                mock_port = 9099
                try:
                    self._mock_server = ThreadedLocalServer(("127.0.0.1", mock_port), LocalExtractionHandler)
                    mock_thread = threading.Thread(target=self._mock_server.serve_forever, daemon=True)
                    mock_thread.start()
                except Exception as e:
                    logger.warning(f"Mock server port notice: {e}")

                self._server = HindsightServer(
                    db_url=db_target,
                    llm_provider="openai",
                    llm_api_key="mock-key",
                    llm_base_url=f"http://127.0.0.1:{mock_port}/v1",
                    llm_model="llama-3.3-70b-versatile",
                    port=settings.HINDSIGHT_PORT,
                    log_level="warning"
                )

            self._server.start(timeout=90.0)
            self._base_url = self._server.url
            self._client = Hindsight(base_url=self._base_url)
            self._is_ready = True
            logger.info(f"HindsightServer operational at {self._base_url}")

    @property
    def client(self) -> Hindsight:
        if not self._client:
            self.initialize()
        return self._client

    async def aretain_interaction(
        self,
        deal_id: str,
        content: str,
        category: str = "fact"
    ) -> dict:
        """
        Retains an interaction in the deal's Hindsight memory bank.
        Tags the memory with its cognitive category (fact, outcome, strategy).
        """
        bank_id = f"deal_{deal_id.lower().replace(' ', '_')}"
        formatted_content = f"[{category.upper()}] {content}"
        
        # Call Hindsight's async retain
        resp = await self.client.aretain(
            bank_id=bank_id,
            content=formatted_content,
            tags=[category, deal_id],
            context=f"Deal intelligence interaction ({category})"
        )
        return {
            "success": True,
            "bank_id": bank_id,
            "items_count": resp.items_count or 1
        }

    async def areset_deal_memory(self, deal_id: str):
        """Deletes the bank to clear all old/polluted memories."""
        bank_id = f"deal_{deal_id.lower().replace(' ', '_')}"
        try:
            await self.client.adelete_bank(bank_id)
            logger.info(f"Successfully cleared Hindsight bank {bank_id}")
        except Exception as e:
            logger.info(f"Reset bank notice for {bank_id} (may already be clean): {e}")

    async def arecall_memories(
        self,
        deal_id: str,
        query: str = "deal intelligence facts history outcomes strategy"
    ) -> DealMemoriesResponse:
        """
        Recalls memories from Hindsight and structures them into:
        1. FACTS (What happened / client remarks)
        2. OUTCOMES (Past attempts and results)
        3. LEARNED STRATEGIES (Inferred patterns)
        """
        bank_id = f"deal_{deal_id.lower().replace(' ', '_')}"
        
        try:
            recall_resp = await self.client.arecall(
                bank_id=bank_id,
                query=query,
                max_tokens=4096
            )
            raw_prompt_context = recall_resp.to_prompt_string()
            results = recall_resp.results or []
        except Exception as e:
            logger.error(f"Recall failed on bank {bank_id}: {e}")
            results = []
            raw_prompt_context = "No memories found."

        facts: List[MemoryItem] = []
        outcomes: List[MemoryItem] = []
        strategies: List[MemoryItem] = []

        for r in results:
            text = r.text
            
            # Defense against prompt leakage: Never expose internal prompt scaffolding
            if any(bad in text.lower() for bad in ["return valid", "extract facts", "chunk:", "event date:", "following chunk"]):
                continue

            cat = "fact"
            clean_text = text

            if text.startswith("[OUTCOME]") or "rejected" in text.lower() or "positively" in text.lower() or "outcome" in text.lower():
                cat = "outcome"
                clean_text = text.replace("[OUTCOME]", "").strip()
            elif text.startswith("[STRATEGY]") or "strategy" in text.lower() or "learned" in text.lower():
                cat = "strategy"
                clean_text = text.replace("[STRATEGY]", "").strip()
            elif text.startswith("[FACT]"):
                cat = "fact"
                clean_text = text.replace("[FACT]", "").strip()

            # Clean up trailing Hindsight fact annotations for executive presentation
            for sep in [" | When:", " | Involving:"]:
                if sep in clean_text:
                    clean_text = clean_text.split(sep)[0].strip()

            item = MemoryItem(
                id=r.id,
                text=clean_text,
                type=r.type,
                category=cat,
                entities=getattr(r, "entities", None),
                context=r.context,
                occurred_at=str(getattr(r, "occurred_start", None) or getattr(r, "mentioned_at", None) or "")
            )

            if cat == "outcome":
                outcomes.append(item)
            elif cat == "strategy":
                strategies.append(item)
            else:
                facts.append(item)

        total_clean = len(facts) + len(outcomes) + len(strategies)

        return DealMemoriesResponse(
            deal_id=deal_id,
            total_memories=total_clean,
            facts=facts,
            outcomes=outcomes,
            strategies=strategies,
            raw_prompt_context=raw_prompt_context
        )

    def shutdown(self):
        """Cleanup server threads on exit."""
        if self._server:
            try:
                self._server.stop()
            except Exception:
                pass
        if self._mock_server:
            try:
                self._mock_server.shutdown()
            except Exception:
                pass

# Global singleton manager
hindsight_manager = HindsightManager()

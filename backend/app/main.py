import logging
from contextlib import asynccontextmanager
from typing import List, Dict, Any

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .schemas import (
    InteractionCreate,
    InteractionResponse,
    DealMemoriesResponse,
    BriefingRequest,
    MeetingBriefing
)
from .memory import hindsight_manager
from .agent import deal_agent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("deal_intelligence.main")

# Pre-defined deals for the dashboard
ACTIVE_DEALS = [
    {"id": "acme-corp", "name": "Acme Corporation", "industry": "Enterprise FinTech", "stage": "Proposal Review"},
    {"id": "cloudscale-io", "name": "CloudScale Systems", "industry": "DevOps & Infrastructure", "stage": "Technical Validation"},
    {"id": "nexus-health", "name": "Nexus Healthcare", "industry": "HealthTech", "stage": "Executive Presentation"}
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Hindsight memory engine on startup
    logger.info("Initializing Hindsight Memory Engine...")
    try:
        hindsight_manager.initialize()
    except Exception as e:
        logger.error(f"Hindsight initialization warning: {e}")
    yield
    # Cleanup on shutdown
    logger.info("Shutting down Hindsight Memory Engine...")
    hindsight_manager.shutdown()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI sales intelligence agent that learns from customer interactions and deal outcomes using Hindsight memory.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React frontend (Vite default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    """Health status check including Hindsight connectivity."""
    if not hindsight_manager._is_ready:
        try:
            hindsight_manager.initialize()
        except Exception as e:
            logger.warning(f"Hindsight health initialization probe: {e}")
    return {
        "status": "healthy",
        "hindsight_connected": hindsight_manager._is_ready,
        "hindsight_base_url": hindsight_manager._base_url,
        "llm_provider": "groq" if bool(settings.GROQ_API_KEY) else "local_fallback"
    }

@app.get("/api/deals")
async def list_deals():
    """List available active deals."""
    return ACTIVE_DEALS

@app.post("/api/interactions", response_model=InteractionResponse)
async def add_interaction(interaction: InteractionCreate):
    """
    Retains a new interaction note into Hindsight persistent memory.
    Categorizes as:
    - 'fact' (Customer statement or requirement)
    - 'outcome' (Sales approach tried and outcome)
    - 'strategy' (Learned rule or tactical principle)
    """
    try:
        result = await hindsight_manager.aretain_interaction(
            deal_id=interaction.deal_id,
            content=interaction.content,
            category=interaction.category
        )
        return InteractionResponse(
            success=True,
            deal_id=interaction.deal_id,
            items_count=result.get("items_count", 1),
            message="Interaction permanently retained into Hindsight memory bank.",
            content=interaction.content,
            category=interaction.category
        )
    except Exception as e:
        logger.error(f"Error retaining interaction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retain interaction in Hindsight: {str(e)}"
        )

@app.get("/api/deals/{deal_id}/memories", response_model=DealMemoriesResponse)
async def get_deal_memories(deal_id: str):
    """
    Recalls all accumulated memories from Hindsight for a specific deal.
    Structured into Facts, Outcomes, and Strategies.
    """
    try:
        return await hindsight_manager.arecall_memories(deal_id=deal_id)
    except Exception as e:
        logger.error(f"Error recalling memories for {deal_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to recall memories from Hindsight: {str(e)}"
        )

@app.post("/api/deals/{deal_id}/briefing", response_model=MeetingBriefing)
async def generate_briefing(deal_id: str, request: BriefingRequest):
    """
    Retrieves accumulated historical memory from Hindsight and produces
    a personalized meeting briefing showing how past outcomes influenced the plan.
    """
    try:
        # 1. Recall historical memory units from Hindsight
        memories = await hindsight_manager.arecall_memories(deal_id=deal_id)
        
        # 2. Invoke Agent reasoning to synthesize adapted strategy
        briefing = await deal_agent.generate_briefing(
            deal_id=deal_id,
            memories=memories,
            objective=request.objective or "Next Executive Sales Meeting",
            attendees=request.attendees or "CTO, VP Engineering, Procurement"
        )
        return briefing
    except Exception as e:
        logger.error(f"Error generating briefing for {deal_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate briefing: {str(e)}"
        )

@app.delete("/api/deals/{deal_id}/memories")
async def clear_deal_memories(deal_id: str):
    """Clears/resets all memories for a deal from Hindsight."""
    await hindsight_manager.areset_deal_memory(deal_id)
    return {"success": True, "message": f"Memories cleared for {deal_id}"}

@app.post("/api/deals/demo-seed")
async def seed_demo_story():
    """
    One-click demo scenario that seeds the classic Acme Corporation story
    directly into Hindsight's real persistent memory bank.
    Clears old/polluted memories first so reseeding produces a pristine state.
    """
    deal_id = "acme-corp"
    
    # 1. Clear any prior memories in Hindsight to avoid duplicates or prompt pollution
    await hindsight_manager.areset_deal_memory(deal_id)

    interactions = [
        ("Acme is concerned about pricing and is comparing us with Competitor X.", "fact"),
        ("Acme's CTO is worried about API integration latency and webhook reliability.", "fact"),
        ("We sent a feature-heavy generic proposal and Acme rejected it because it felt off-the-shelf.", "outcome"),
        ("We gave a deep-dive technical architecture walkthrough and the CTO responded very positively.", "outcome"),
        ("Acme values engineering transparency and architectural alignment far more than generic discount haggling.", "strategy")
    ]

    stored_count = 0
    for content, category in interactions:
        try:
            await hindsight_manager.aretain_interaction(deal_id=deal_id, content=content, category=category)
            stored_count += 1
        except Exception as e:
            logger.warning(f"Error seeding item: {e}")

    return {
        "success": True,
        "deal_id": deal_id,
        "seeded_count": stored_count,
        "message": "Acme demo story successfully retained in Hindsight memory bank."
    }

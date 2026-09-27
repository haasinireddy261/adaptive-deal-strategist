import os
import sys
import asyncio
from dotenv import load_dotenv

load_dotenv()

from backend.app.memory import hindsight_manager

async def run_smoke_test():
    print("==============================================")
    print("HINDSIGHT SMOKE TEST (REAL PERSISTENT MEMORY)")
    print("==============================================")
    
    # 1. Initialize Hindsight
    print("\n1. Initializing Hindsight engine...")
    hindsight_manager.initialize()
    print(f"Hindsight base URL: {hindsight_manager._base_url}")
    
    # 2. Retain interaction into Hindsight bank
    deal_bank = "acme-corp"
    interaction = "Acme's CTO is concerned about API integration latency and webhook reliability."
    print(f"\n2. Retaining interaction into Hindsight for '{deal_bank}':\n   \"{interaction}\"")
    retain_res = await hindsight_manager.aretain_interaction(
        deal_id=deal_bank,
        content=interaction,
        category="fact"
    )
    print(f"   --> Retain successful! Items count: {retain_res.get('items_count')}")
    
    # 3. Recall memory with a relevant query
    query = "What is the CTO worried about?"
    print(f"\n3. Recalling memory with query: \"{query}\"")
    memories = await hindsight_manager.arecall_memories(
        deal_id=deal_bank,
        query=query
    )
    print(f"   --> Recall returned {memories.total_memories} memory items:")
    for idx, f in enumerate(memories.facts, 1):
        print(f"   [{idx}] [FACT]: {f.text}")
    for idx, o in enumerate(memories.outcomes, 1):
        print(f"   [{idx}] [OUTCOME]: {o.text}")
    for idx, s in enumerate(memories.strategies, 1):
        print(f"   [{idx}] [STRATEGY]: {s.text}")
        
    print(f"\n4. Verified LLM Prompt Context from Hindsight:\n{memories.raw_prompt_context[:300]}...")
    
    assert memories.total_memories > 0, "No memories recalled from Hindsight!"
    print("\n==============================================")
    print("SMOKE TEST COMPLETE: HINDSIGHT IS FULLY OPERATIONAL!")
    print("==============================================")

if __name__ == "__main__":
    asyncio.run(run_smoke_test())

import asyncio
import httpx
from backend.app.main import app

async def run_e2e_verification():
    print("==================================================")
    print("ADAPTIVE DEAL STRATEGIST - END-TO-END VERIFICATION")
    print("==================================================")

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Step 1: Health Check & Hindsight Connection
        print("\n[Step 1] Checking Health & Hindsight connection...")
        res = await client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        health_data = res.json()
        print(f" -> Status: {health_data.get('status')}")
        print(f" -> Hindsight Connected: {health_data.get('hindsight_connected')}")
        print(f" -> Hindsight Base URL: {health_data.get('hindsight_base_url')}")
        assert health_data.get("hindsight_connected") is True

        # Step 2: Seed Acme Demo Story
        print("\n[Step 2] Triggering 'Load Acme Demo Story' (seeding Hindsight)...")
        res = await client.post("/api/deals/demo-seed")
        assert res.status_code == 200, f"Demo seed failed: {res.text}"
        seed_data = res.json()
        print(f" -> Seeded {seed_data.get('seeded_count')} interactions into Hindsight memory bank '{seed_data.get('deal_id')}'.")
        assert seed_data.get("seeded_count") > 0

        # Step 3: Recall Accumulated Memories from Hindsight
        print("\n[Step 3] Recalling Accumulated Memories from Hindsight...")
        res = await client.get("/api/deals/acme-corp/memories")
        assert res.status_code == 200, f"Memories retrieval failed: {res.text}"
        memories = res.json()
        initial_count = memories.get("total_memories")
        print(f" -> Total memories recalled from Hindsight: {initial_count}")
        print(f" -> Facts: {len(memories.get('facts', []))}")
        print(f" -> Outcomes: {len(memories.get('outcomes', []))}")
        print(f" -> Strategies: {len(memories.get('strategies', []))}")
        assert initial_count > 0

        # Step 4: Generate Initial Meeting Briefing (Before New Experience)
        print("\n[Step 4] Generating Initial Meeting Briefing (Architecture-First Strategy)...")
        briefing_req = {
            "deal_id": "acme-corp",
            "objective": "Executive Deal Closing Meeting",
            "attendees": "CTO, VP Engineering, Procurement"
        }
        res = await client.post("/api/deals/acme-corp/briefing", json=briefing_req)
        assert res.status_code == 200, f"Briefing generation failed: {res.text}"
        briefing_initial = res.json()

        print("\n--- INITIAL STRATEGY EVOLUTION ---")
        strat_evo = briefing_initial.get("strategy_evolution")
        assert strat_evo is not None, "strategy_evolution must be present!"
        print(f"Previous Strategy: {strat_evo.get('previous_strategy')}")
        print(f"What Agent Learned: {strat_evo.get('what_agent_learned')}")
        print(f"Updated Strategy: {strat_evo.get('updated_strategy')}")
        print(f"Execution Rule: {strat_evo.get('current_execution_rule')}")

        print("\n--- DEAL TIMELINE ---")
        timeline = briefing_initial.get("deal_timeline", [])
        assert len(timeline) > 0, "deal_timeline must contain events!"
        for ev in timeline:
            print(f"  * [{ev.get('time_label')}] {ev.get('title')} ({ev.get('status').upper()})")
            print(f"    Action: {ev.get('action')}")
            print(f"    Outcome: {ev.get('outcome')}")

        # Step 5: Demo Step 5 - Add New Interaction (CTO Deployment Reliability)
        print("\n[Step 5] Adding New Interaction to Hindsight (CTO Deployment Reliability)...")
        new_interaction = {
            "deal_id": "acme-corp",
            "content": "Acme's CTO is now primarily concerned about deployment reliability and rollback safety.",
            "category": "fact"
        }
        res = await client.post("/api/interactions", json=new_interaction)
        assert res.status_code == 200, f"Add interaction failed: {res.text}"
        print(" -> Interaction successfully retained in Hindsight memory bank.")

        # Step 6: Verify Memory Bank Updated
        print("\n[Step 6] Verifying Hindsight Recall reflects updated experience...")
        res = await client.get("/api/deals/acme-corp/memories")
        assert res.status_code == 200
        updated_memories = res.json()
        print(f" -> Updated total memories in Hindsight: {updated_memories.get('total_memories')}")
        assert updated_memories.get("total_memories") >= initial_count

        # Step 7: Re-synthesize Meeting Briefing (After New Experience)
        print("\n[Step 7] Re-synthesizing Briefing — Verifying Strategy Evolution Adaptation...")
        res = await client.post("/api/deals/acme-corp/briefing", json=briefing_req)
        assert res.status_code == 200
        briefing_evolved = res.json()

        evolved_evo = briefing_evolved.get("strategy_evolution")
        assert evolved_evo is not None
        print(f"\n[EVOLVED STRATEGY UPDATE]")
        print(f"  Previous: {evolved_evo.get('previous_strategy')}")
        print(f"  New Experience: {evolved_evo.get('new_experience')}")
        print(f"  What Agent Learned: {evolved_evo.get('what_agent_learned')}")
        print(f"  Updated Strategy: {evolved_evo.get('updated_strategy')}")
        print(f"  Execution Rule: {evolved_evo.get('current_execution_rule')}")

        # Verify strategy evolved to include reliability / rollback
        evolved_strats = briefing_evolved.get("current_recommended_strategy", [])
        print("\n[NEW RECOMMENDED ACTIONS]")
        for s in evolved_strats:
            print(f"  + {s}")
        
        has_rel_strat = any("reliability" in s.lower() or "rollback" in s.lower() or "sla" in s.lower() for s in evolved_strats)
        assert has_rel_strat, "Strategy must have evolved to address reliability / rollback!"

        print("\n[UPDATED WHY THIS RECOMMENDATION (MEMORY ATTRIBUTION)]")
        why_list = briefing_evolved.get("why_this_recommendation", [])
        assert len(why_list) > 0
        for why in why_list[:4]:
            print(f"  * Recalled [{why.get('category').upper()}]: \"{why.get('memory_text')}\"")
            print(f"    --> Impact: {why.get('influence_on_strategy')}")

        print("\n==================================================")
        print("ALL VERIFICATIONS PASSED: 100% SUCCESS!")
        print("Strategy Evolution dynamically proven through Hindsight!")
        print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_e2e_verification())

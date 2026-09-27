import asyncio
import httpx
from backend.app.main import app
from backend.app.schemas import InteractionCreate, BriefingRequest

async def run_api_tests():
    print("========================================")
    print("RUNNING FASTAPI BACKEND INTEGRATION TEST")
    print("========================================")

    # Use httpx.AsyncClient with ASGITransport
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        print("\n1. Testing GET /api/health...")
        health_resp = await client.get("/api/health")
        print(f"Status: {health_resp.status_code}, Body: {health_resp.json()}")
        assert health_resp.status_code == 200

        # 2. Add Fact Interaction
        print("\n2. Testing POST /api/interactions (Fact)...")
        fact_payload = {
            "deal_id": "acme-corp",
            "content": "Acme's CTO is worried about API integration and latency requirements.",
            "category": "fact"
        }
        fact_resp = await client.post("/api/interactions", json=fact_payload)
        print(f"Status: {fact_resp.status_code}, Body: {fact_resp.json()}")
        assert fact_resp.status_code == 200

        # 3. Add Outcome Interaction
        print("\n3. Testing POST /api/interactions (Outcome)...")
        outcome_payload = {
            "deal_id": "acme-corp",
            "content": "We sent a feature-heavy generic proposal and Acme rejected it because it lacked technical substance.",
            "category": "outcome"
        }
        outcome_resp = await client.post("/api/interactions", json=outcome_payload)
        print(f"Status: {outcome_resp.status_code}, Body: {outcome_resp.json()}")
        assert outcome_resp.status_code == 200

        # 4. Get Memories from Hindsight
        print("\n4. Testing GET /api/deals/acme-corp/memories...")
        mem_resp = await client.get("/api/deals/acme-corp/memories")
        print(f"Status: {mem_resp.status_code}")
        mem_data = mem_resp.json()
        print(f"Total memories retrieved: {mem_data.get('total_memories')}")
        print(f"Facts count: {len(mem_data.get('facts', []))}")
        print(f"Outcomes count: {len(mem_data.get('outcomes', []))}")
        assert mem_resp.status_code == 200

        # 5. Generate Meeting Briefing
        print("\n5. Testing POST /api/deals/acme-corp/briefing...")
        briefing_payload = {
            "deal_id": "acme-corp",
            "objective": "Q4 Technical Evaluation Review",
            "attendees": "CTO, VP Architecture"
        }
        briefing_resp = await client.post("/api/deals/acme-corp/briefing", json=briefing_payload)
        print(f"Status: {briefing_resp.status_code}")
        assert briefing_resp.status_code == 200
        briefing = briefing_resp.json()
        
        print("\n--- GENERATED MEETING BRIEFING ---")
        print(f"Deal Name: {briefing.get('deal_name')}")
        print(f"Understanding: {briefing.get('current_deal_understanding')}")
        print("Important Facts:", briefing.get("important_remembered_facts"))
        print("Previous Outcomes:", briefing.get("previous_approaches_and_outcomes"))
        print("Learned Strategy:", briefing.get("learned_strategy"))
        print("Current Recommended Strategy:", briefing.get("current_recommended_strategy"))
        print("Things to Avoid:", briefing.get("things_to_avoid"))
        print("Why This Recommendation (Memory Attribution):")
        for why in briefing.get("why_this_recommendation", []):
            print(f"  * [{why.get('category').upper()}] \"{why.get('memory_text')}\"")
            print(f"    --> {why.get('influence_on_strategy')}")

        print("\n========================================")
        print("BACKEND INTEGRATION TESTS PASSED 100%!")
        print("========================================")

if __name__ == "__main__":
    asyncio.run(run_api_tests())

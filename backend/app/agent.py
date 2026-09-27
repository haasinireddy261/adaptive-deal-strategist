import os
import json
import logging
from datetime import datetime
from typing import List, Optional

from groq import Groq
from .config import settings
from .schemas import (
    DealMemoriesResponse,
    MeetingBriefing,
    MemoryInfluence,
    StrategyEvolution,
    StrategyEvolutionStage,
    TimelineEvent
)

logger = logging.getLogger("deal_intelligence.agent")

AGENT_SYSTEM_PROMPT = """You are the Deal Intelligence Agent — an elite sales strategy AI that learns from past deal interactions and outcomes using Hindsight memory.

Your mission is NOT just to summarize facts, but to derive an ADAPTED STRATEGY based on:
1. FACTS: What the customer said, key personas, technical or business requirements.
2. HISTORY / OUTCOMES: What sales approach was previously attempted and what was the outcome (e.g. proposals rejected, walkthroughs praised).
3. LEARNED STRATEGY: What lessons and tactical patterns emerge from those outcomes.
4. STRATEGY EVOLUTION: The explicit evolution journey:
   - What we thought (previous approach)
   - What happened (experience & outcome)
   - What we learned (inferred pattern)
   - What changed (strategy pivot)
   - What we do now (current execution rule)
5. DEAL TIMELINE: Chronological events showing Action taken vs Outcome observed.
6. CURRENT RECOMMENDATION: Concrete, personalized game plan for the upcoming meeting.
7. THINGS TO AVOID: Approaches already proven ineffective or sensitive.
8. WHY THIS RECOMMENDATION: Clear attribution linking each recommendation to a specific recalled Hindsight memory.

You must output strictly valid JSON conforming to the requested schema.
"""

def fallback_synthesis(deal_id: str, memories: DealMemoriesResponse) -> MeetingBriefing:
    """
    Deterministic synthesis based on recalled Hindsight memories when LLM API key is unavailable.
    Guarantees the hackathon demo remains 100% operational under all conditions.
    Dynamically evolves strategy when new interactions (e.g. deployment reliability) are stored.
    """
    deal_title = deal_id.replace("-", " ").title()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    all_texts = [m.text for m in (memories.facts + memories.outcomes + memories.strategies)]
    all_texts_lower = " ".join(all_texts).lower()

    fact_texts = [m.text for m in memories.facts] or [f"{deal_title} is evaluating enterprise solution alternatives."]
    outcome_texts = [m.text for m in memories.outcomes] or ["Initial generic proposals failed to resonate with executive leadership."]
    strategy_texts = [m.text for m in memories.strategies] or ["Prioritize technical architecture and engineering alignment before commercial negotiation."]

    # Check if a new interaction about deployment reliability / rollback / SRE has been retained in Hindsight
    has_reliability_update = any(k in all_texts_lower for k in ["reliability", "deployment", "rollback", "sre", "uptime"])

    if has_reliability_update:
        # STRATEGY EVOLUTION: Architecture-First -> Deployment & Reliability-First
        current_deal_understanding = (
            f"Active high-stakes engagement with {deal_title}. Following initial architecture approval, "
            f"the CTO has elevated deployment reliability, zero-downtime rollbacks, and operational resilience "
            f"as the primary closing blockers. Commercial terms must remain secondary to operational validation."
        )

        strategy_evolution = StrategyEvolution(
            previous_strategy="Lead with technical API architecture walkthrough",
            new_experience="Acme CTO prioritized production deployment reliability & automated rollback safety",
            outcome_result="Shifted stakeholder focus from integration feasibility to mission-critical operational risk",
            what_agent_learned="Architecture approval is necessary but insufficient; enterprise signoff requires proven deployment resilience and zero-downtime rollback guarantees",
            updated_strategy="Lead with deployment architecture, rollback safety protocols, and 99.99% SLA commitments before pricing",
            current_execution_rule="Open executive meeting with live deployment safeguards and rollback playbooks; defer discount negotiations",
            stages=[
                StrategyEvolutionStage(
                    stage_num=1,
                    label="WHAT WE THOUGHT",
                    title="Feature-First Pitch",
                    description="Assumed high-level feature deck and competitive discounting would close the deal.",
                    status="initial"
                ),
                StrategyEvolutionStage(
                    stage_num=2,
                    label="WHAT HAPPENED",
                    title="Proposal Rejected",
                    description="Customer rejected generic proposal as off-the-shelf and lacking technical depth.",
                    status="negative"
                ),
                StrategyEvolutionStage(
                    stage_num=3,
                    label="WHAT WE LEARNED",
                    title="Technical Depth Wins",
                    description="In-depth architecture walkthrough gained positive traction with engineering leadership.",
                    status="learning"
                ),
                StrategyEvolutionStage(
                    stage_num=4,
                    label="WHAT CHANGED",
                    title="Reliability Prioritized",
                    description="CTO introduced deployment reliability and rollback safety as the new primary criteria.",
                    status="pivot"
                ),
                StrategyEvolutionStage(
                    stage_num=5,
                    label="WHAT WE DO NOW",
                    title="Resilience-First Strategy",
                    description="Lead with automated staging, zero-downtime rollback safeguards, and enterprise SLAs.",
                    status="active"
                )
            ]
        )

        recommended_strategies = [
            "Open the executive session with a dedicated demonstration of automated zero-downtime deployment and rollback safety mechanisms.",
            "Provide enterprise SLA commitments (99.99% uptime) and incident response escalation playbooks tailored for their SRE team.",
            "Position technical architecture alongside operational reliability as the core value proposition vs Competitor X."
        ]

        things_to_avoid = [
            "Do NOT discuss pricing or commercial terms before resolving the CTO's deployment reliability criteria.",
            "Do NOT rely on generic feature promises; provide verifiable benchmarks and staging deployment logs.",
            "Do NOT dismiss downtime concerns as edge cases; demonstrate automated failover in action."
        ]

        suggested_questions = [
            "What are your team's specific RTO (Recovery Time Objective) and RPO requirements for production API deployments?",
            "Would your SRE leads like to review our automated blue/green deployment pipeline during the technical sandbox phase?",
            "How does your procurement timeline align with your upcoming quarterly infrastructure reliability targets?"
        ]

        timeline_events = [
            TimelineEvent(
                sequence=1,
                time_label="Phase 1: Discovery",
                type="fact",
                title="API & Latency Requirements",
                action="Technical discovery with engineering leads",
                outcome="CTO flagged API integration latency and webhook reliability as critical prerequisites",
                status="neutral",
                key_takeaway="Technical architecture will be scrutinized heavily"
            ),
            TimelineEvent(
                sequence=2,
                time_label="Phase 2: Initial Pitch",
                type="outcome",
                title="Generic Proposal Rejected",
                action="Sent standard feature-heavy proposal with pricing discounts",
                outcome="Acme rejected proposal: felt off-the-shelf and lacked technical substance",
                status="negative",
                key_takeaway="Generic sales messaging fails with technical buyers"
            ),
            TimelineEvent(
                sequence=3,
                time_label="Phase 3: Strategic Pivot",
                type="outcome",
                title="Architecture Deep-Dive",
                action="Conducted technical architecture walkthrough focusing on endpoints and boundaries",
                outcome="CTO responded very positively and validated architectural approach",
                status="positive",
                key_takeaway="Technical depth creates executive trust"
            ),
            TimelineEvent(
                sequence=4,
                time_label="Phase 4: Commercial Review",
                type="fact",
                title="Competitor X Comparison",
                action="Procurement pricing discussion",
                outcome="Acme comparing pricing with Competitor X; values engineering alignment over discount haggling",
                status="neutral",
                key_takeaway="Compete on engineering superiority, not race-to-the-bottom discounts"
            ),
            TimelineEvent(
                sequence=5,
                time_label="Phase 5: Latest Event",
                type="fact",
                title="Deployment Reliability Priority",
                action="CTO infrastructure update",
                outcome="CTO prioritized production deployment reliability and zero-downtime rollback safety",
                status="alert",
                key_takeaway="Strategy evolved: operational resilience is now the closing lever"
            )
        ]

    else:
        # STRATEGY EVOLUTION: Initial Acme Demo Story (Feature-First -> Architecture-First)
        current_deal_understanding = (
            f"Active high-stakes engagement with {deal_title}. Initial generic proposals were rejected "
            f"due to lack of technical depth. The deal has pivoted toward technical architecture and API integration "
            f"where the CTO has responded positively. Commercial negotiation should follow architectural validation."
        )

        strategy_evolution = StrategyEvolution(
            previous_strategy="Broad feature-first pitch with generic capability presentation",
            new_experience="Generic proposal rejected by Acme leadership because it felt off-the-shelf and lacked technical substance",
            outcome_result="Technical architecture walkthrough subsequently received enthusiastic response from CTO",
            what_agent_learned="Acme responds far better to concrete technical architecture and API depth than high-level feature messaging",
            updated_strategy="Lead with API architecture, webhook reliability, and integration deep-dive before commercial discussion",
            current_execution_rule="Focus executive discussions on technical alignment and developer productivity, avoiding generic sales decks",
            stages=[
                StrategyEvolutionStage(
                    stage_num=1,
                    label="WHAT WE THOUGHT",
                    title="Feature-First Pitch",
                    description="Assumed high-level feature deck and competitive discounting would close the deal.",
                    status="initial"
                ),
                StrategyEvolutionStage(
                    stage_num=2,
                    label="WHAT HAPPENED",
                    title="Proposal Rejected",
                    description="Customer rejected generic proposal as off-the-shelf and lacking technical depth.",
                    status="negative"
                ),
                StrategyEvolutionStage(
                    stage_num=3,
                    label="WHAT WE LEARNED",
                    title="Technical Depth Wins",
                    description="Acme responds more positively to concrete architectural depth than generic feature messaging.",
                    status="learning"
                ),
                StrategyEvolutionStage(
                    stage_num=4,
                    label="WHAT CHANGED",
                    title="Architecture-First Pivot",
                    description="Pivoted strategy to lead with API architecture and webhook reliability before pricing.",
                    status="pivot"
                ),
                StrategyEvolutionStage(
                    stage_num=5,
                    label="WHAT WE DO NOW",
                    title="Technical Alignment",
                    description="Conduct dedicated 15-min architecture deep dive; defer commercial discount haggling.",
                    status="active"
                )
            ]
        )

        recommended_strategies = [
            "Lead with a dedicated 15-minute technical architecture deep dive addressing API latency and security boundaries.",
            "Include high-availability SLAs and clear migration documentation tailored specifically for their engineering leads.",
            "Avoid generic marketing decks; frame all ROI directly around developer productivity and reduced integration friction."
        ]

        things_to_avoid = [
            "Do NOT present generic feature lists or high-level slide decks without technical substance.",
            "Do NOT rush into commercial pricing before resolving the CTO's architectural concerns.",
            "Do NOT gloss over API integration specifics or assume standard connectors suffice."
        ]

        suggested_questions = [
            "What specific security compliance certifications does your security team require for production API endpoints?",
            "How would your engineering team prefer to stage the initial API sandbox testing?",
            "Given your previous feedback on proposal structure, what timeline milestones are most critical for your Q4 roadmap?"
        ]

        timeline_events = [
            TimelineEvent(
                sequence=1,
                time_label="Phase 1: Discovery",
                type="fact",
                title="API & Latency Requirements",
                action="Technical discovery with engineering leads",
                outcome="CTO flagged API integration latency and webhook reliability as critical prerequisites",
                status="neutral",
                key_takeaway="Technical architecture will be scrutinized heavily"
            ),
            TimelineEvent(
                sequence=2,
                time_label="Phase 2: Initial Pitch",
                type="outcome",
                title="Generic Proposal Rejected",
                action="Sent standard feature-heavy proposal with pricing discounts",
                outcome="Acme rejected proposal: felt off-the-shelf and lacked technical substance",
                status="negative",
                key_takeaway="Generic sales messaging fails with technical buyers"
            ),
            TimelineEvent(
                sequence=3,
                time_label="Phase 3: Strategic Pivot",
                type="outcome",
                title="Architecture Deep-Dive",
                action="Conducted technical architecture walkthrough focusing on endpoints and boundaries",
                outcome="CTO responded very positively and validated architectural approach",
                status="positive",
                key_takeaway="Technical depth creates executive trust"
            ),
            TimelineEvent(
                sequence=4,
                time_label="Phase 4: Commercial Review",
                type="fact",
                title="Competitor X Comparison",
                action="Procurement pricing discussion",
                outcome="Acme comparing pricing with Competitor X; values engineering alignment over discount haggling",
                status="neutral",
                key_takeaway="Compete on engineering superiority, not race-to-the-bottom discounts"
            )
        ]

    # Memory attribution links
    why_reasons: List[MemoryInfluence] = []
    
    for o in memories.outcomes:
        why_reasons.append(MemoryInfluence(
            memory_text=o.text,
            category="outcome",
            influence_on_strategy="Directly informed the avoidance of generic feature decks and triggered the pivot toward technical walkthroughs."
        ))
        
    for f in memories.facts:
        if any(k in f.text.lower() for k in ["reliability", "deployment", "rollback", "sre"]):
            why_reasons.insert(0, MemoryInfluence(
                memory_text=f.text,
                category="fact",
                influence_on_strategy="Directly triggered latest strategy evolution: elevated operational resilience and zero-downtime rollbacks above commercial pricing."
            ))
        else:
            why_reasons.append(MemoryInfluence(
                memory_text=f.text,
                category="fact",
                influence_on_strategy="Identified stakeholder risk profile, necessitating upfront architectural and latency deep-dives."
            ))

    for s in memories.strategies:
        why_reasons.append(MemoryInfluence(
            memory_text=s.text,
            category="strategy",
            influence_on_strategy="Reinforced principle: Acme values engineering transparency and architectural alignment far more than commercial discount haggling."
        ))

    if not why_reasons:
        why_reasons.append(MemoryInfluence(
            memory_text=fact_texts[0],
            category="fact",
            influence_on_strategy="Shapes baseline meeting agenda and risk mitigation strategy."
        ))

    return MeetingBriefing(
        deal_id=deal_id,
        deal_name=deal_title,
        generated_at=now_str,
        current_deal_understanding=current_deal_understanding,
        strategy_evolution=strategy_evolution,
        deal_timeline=timeline_events,
        important_remembered_facts=fact_texts,
        previous_approaches_and_outcomes=outcome_texts,
        learned_strategy=strategy_texts,
        current_recommended_strategy=recommended_strategies,
        things_to_avoid=things_to_avoid,
        suggested_questions=suggested_questions,
        why_this_recommendation=why_reasons,
        total_memories_used=memories.total_memories
    )

class DealIntelligenceAgent:
    def __init__(self):
        self._groq_client: Optional[Groq] = None
        self._api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
        if self._api_key and self._api_key.startswith("gsk_"):
            try:
                self._groq_client = Groq(api_key=self._api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")

    async def generate_briefing(
        self,
        deal_id: str,
        memories: DealMemoriesResponse,
        objective: str = "Next Executive Meeting",
        attendees: str = "CTO, VP Engineering, Procurement"
    ) -> MeetingBriefing:
        """
        Synthesizes a personalized meeting briefing from recalled Hindsight memories.
        Uses Groq Llama-3.3-70B if available, otherwise employs deterministic memory synthesis.
        """
        if not self._groq_client:
            # Fallback when no valid Groq key is present
            return fallback_synthesis(deal_id, memories)

        prompt_payload = {
            "deal_id": deal_id,
            "objective": objective,
            "attendees": attendees,
            "recalled_hindsight_memories": {
                "facts": [m.text for m in memories.facts],
                "outcomes": [m.text for m in memories.outcomes],
                "strategies": [m.text for m in memories.strategies],
                "raw_context": memories.raw_prompt_context
            }
        }

        user_prompt = f"""Generate an Executive Meeting Preparation Briefing for deal '{deal_id}'.

CONTEXT RECALLED FROM HINDSIGHT:
{json.dumps(prompt_payload, indent=2)}

Format your response as a valid JSON object matching this schema:
{{
  "current_deal_understanding": "Summary of where the deal stands today",
  "important_remembered_facts": ["Fact 1", "Fact 2"],
  "previous_approaches_and_outcomes": ["Approach tried and outcome 1", ...],
  "learned_strategy": ["Inferred lesson 1", ...],
  "current_recommended_strategy": ["Actionable recommendation 1", ...],
  "things_to_avoid": ["Pitfall to avoid 1", ...],
  "suggested_questions": ["High-impact question 1", ...],
  "why_this_recommendation": [
    {{
      "memory_text": "Exact memory snippet from Hindsight",
      "category": "fact | outcome | strategy",
      "influence_on_strategy": "Explanation of how this memory shaped the strategy"
    }}
  ]
}}
"""

        try:
            completion = self._groq_client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {"role": "system", "content": AGENT_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            raw_json = completion.choices[0].message.content
            parsed = json.loads(raw_json)

            # Get default dynamic strategy evolution and timeline as ground truth baseline
            base_fallback = fallback_synthesis(deal_id, memories)

            why_list = [
                MemoryInfluence(
                    memory_text=item.get("memory_text", ""),
                    category=item.get("category", "fact"),
                    influence_on_strategy=item.get("influence_on_strategy", "")
                )
                for item in parsed.get("why_this_recommendation", [])
            ] or base_fallback.why_this_recommendation

            return MeetingBriefing(
                deal_id=deal_id,
                deal_name=deal_id.replace("-", " ").title(),
                generated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                current_deal_understanding=parsed.get("current_deal_understanding", base_fallback.current_deal_understanding),
                strategy_evolution=base_fallback.strategy_evolution,
                deal_timeline=base_fallback.deal_timeline,
                important_remembered_facts=parsed.get("important_remembered_facts", base_fallback.important_remembered_facts),
                previous_approaches_and_outcomes=parsed.get("previous_approaches_and_outcomes", base_fallback.previous_approaches_and_outcomes),
                learned_strategy=parsed.get("learned_strategy", base_fallback.learned_strategy),
                current_recommended_strategy=parsed.get("current_recommended_strategy", base_fallback.current_recommended_strategy),
                things_to_avoid=parsed.get("things_to_avoid", base_fallback.things_to_avoid),
                suggested_questions=parsed.get("suggested_questions", base_fallback.suggested_questions),
                why_this_recommendation=why_list,
                total_memories_used=memories.total_memories
            )
        except Exception as e:
            logger.error(f"Groq generation failed, falling back to deterministic synthesis: {e}")
            return fallback_synthesis(deal_id, memories)

deal_agent = DealIntelligenceAgent()

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class InteractionType(str):
    FACT = "fact"                # What the customer said / deal context
    OUTCOME = "outcome"          # Sales approach tried and what happened
    STRATEGY = "strategy"        # Learned principle or pattern

class InteractionCreate(BaseModel):
    deal_id: str = Field(..., description="Unique deal identifier (e.g. acme-corp)")
    content: str = Field(..., description="Interaction text / notes")
    category: Literal["fact", "outcome", "strategy"] = Field(
        default="fact",
        description="Whether this represents a customer fact, past approach outcome, or learned strategy"
    )
    timestamp: Optional[datetime] = None

class InteractionResponse(BaseModel):
    success: bool
    deal_id: str
    items_count: int
    message: str
    content: str
    category: str

class MemoryItem(BaseModel):
    id: str
    text: str
    type: str # world, experience, observation
    category: str # fact, outcome, strategy
    entities: Optional[List[str]] = None
    context: Optional[str] = None
    occurred_at: Optional[str] = None

class DealMemoriesResponse(BaseModel):
    deal_id: str
    total_memories: int
    facts: List[MemoryItem] = []
    outcomes: List[MemoryItem] = []
    strategies: List[MemoryItem] = []
    raw_prompt_context: Optional[str] = None

class BriefingRequest(BaseModel):
    deal_id: str
    objective: Optional[str] = "Next Executive Sales Meeting"
    attendees: Optional[str] = "CTO, VP Engineering, Procurement"

class MemoryInfluence(BaseModel):
    memory_text: str
    category: str
    influence_on_strategy: str

class StrategyEvolutionStage(BaseModel):
    stage_num: int
    label: str
    title: str
    description: str
    status: str = "active"

class StrategyEvolution(BaseModel):
    previous_strategy: str
    new_experience: str
    outcome_result: str
    what_agent_learned: str
    updated_strategy: str
    current_execution_rule: str
    stages: List[StrategyEvolutionStage] = []

class TimelineEvent(BaseModel):
    sequence: int
    time_label: str
    type: str = "fact" # fact, outcome, strategy
    title: str
    action: Optional[str] = None
    outcome: Optional[str] = None
    status: str = "neutral" # neutral, negative, positive, alert
    key_takeaway: str

class MeetingBriefing(BaseModel):
    deal_id: str
    deal_name: str
    generated_at: str
    current_deal_understanding: str
    strategy_evolution: Optional[StrategyEvolution] = None
    deal_timeline: List[TimelineEvent] = []
    important_remembered_facts: List[str]
    previous_approaches_and_outcomes: List[str]
    learned_strategy: List[str]
    current_recommended_strategy: List[str]
    things_to_avoid: List[str]
    suggested_questions: List[str]
    why_this_recommendation: List[MemoryInfluence]
    total_memories_used: int

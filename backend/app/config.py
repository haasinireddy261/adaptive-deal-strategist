import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Deal Intelligence Agent"
    API_PREFIX: str = "/api"
    
    # LLM Settings (Groq default)
    GROQ_API_KEY: str = ""
    LLM_MODEL: str = "llama-3.3-70b-versatile"
    
    # Hindsight Server Settings
    HINDSIGHT_BASE_URL: str = "http://127.0.0.1:8899"
    HINDSIGHT_PORT: int = 8899
    HINDSIGHT_API_KEY: Optional[str] = None
    
    # Backend Server Settings
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings(
    GROQ_API_KEY=os.getenv("GROQ_API_KEY", ""),
    HINDSIGHT_BASE_URL=os.getenv("HINDSIGHT_BASE_URL", "http://127.0.0.1:8899"),
)

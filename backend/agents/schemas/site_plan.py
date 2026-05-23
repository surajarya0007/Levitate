from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing import List, Optional, Any, Union
import json

class Page(BaseModel):
    title: str = Field(..., description="The title of the page (e.g., 'Home', 'About Us')")
    description: str = Field(..., description="A brief description of the page's purpose and content")
    features: List[str] = Field(default_factory=list, description="List of key features or sections on this page")

class SitePlan(BaseModel):
    site_name: str = Field(..., description="The name of the website")
    description: str = Field(..., description="A short summary of the website's goal")
    theme: str = Field(..., description="The visual theme or style (e.g., 'Modern and Minimalist', 'Professional Corporate')")
    pages: List[Page] = Field(..., description="List of pages to be included in the website")

    @field_validator('theme', mode='before')
    @classmethod
    def allow_dict_theme(cls, v: Any) -> str:
        if isinstance(v, dict):
            # If the LLM returns a detailed dict, flatten it to a string description
            return json.dumps(v)
        return v

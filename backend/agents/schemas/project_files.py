from pydantic import BaseModel, Field
from typing import Dict

class ProjectFiles(BaseModel):
    files: Dict[str, str] = Field(
        ..., 
        description="A dictionary where keys are file paths (e.g., 'components/Hero.tsx', 'app/page.tsx') and values are the file content (code)."
    )

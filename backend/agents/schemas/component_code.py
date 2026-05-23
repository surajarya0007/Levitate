from pydantic import BaseModel, Field

class ComponentCode(BaseModel):
    filename: str = Field(..., description="The filename for the component (e.g., 'Hero.tsx')")
    code: str = Field(..., description="The full React component code using Tailwind CSS")
    imports: list[str] = Field(default_factory=list, description="List of import statements required")

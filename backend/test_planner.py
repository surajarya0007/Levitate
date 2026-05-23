from unittest.mock import MagicMock, patch
import json
from agents.planner_agent import PlannerAgent
from agents.schemas.site_plan import SitePlan

def test_planner_agent():
    # Mock response data
    mock_plan = {
        "site_name": "Test Site",
        "description": "A test website",
        "theme": "Minimalist",
        "pages": [
            {
                "title": "Home",
                "description": "Landing page",
                "features": ["Hero section", "CTA"]
            }
        ]
    }

    # Patch OpenAI client
    with patch("agents.base_agent.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        MockOpenAI.return_value = mock_client
        
        mock_completion = MagicMock()
        mock_completion.choices[0].message.content = json.dumps(mock_plan)
        mock_client.chat.completions.create.return_value = mock_completion
        
        # Test Agent
        agent = PlannerAgent()
        plan = agent.plan_website("Create a test site")
        
        print("Plan generated successfully:")
        print(plan.model_dump_json(indent=2))
        
        assert isinstance(plan, SitePlan)
        assert plan.site_name == "Test Site"
        assert len(plan.pages) == 1

if __name__ == "__main__":
    test_planner_agent()

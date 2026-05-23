from agents.ui_agent import UiAgent
from agents.schemas.site_plan import SitePlan, Page
import os
from dotenv import load_dotenv

load_dotenv()

def test_ui_agent_contract():
    print("Initializing UI Agent...")
    agent = UiAgent()
    
    # Mock Site Plan
    site_plan = SitePlan(
        site_name="TestSite",
        description="A test site",
        theme="Modern",
        pages=[
            Page(
                title="Home",
                description="Landing page",
                features=["Hero Section", "Features List", "Contact Form"]
            )
        ]
    )
    
    print("Generating site files...")
    result = agent.generate_site(site_plan)
    
    print("\nFiles generated:")
    for path in result.files.keys():
        print(f" - {path}")
        
    # Validation
    assert "app/page.tsx" in result.files, "Missing app/page.tsx"
    
    # Check for components (fuzzy check since names vary)
    has_components = any(k.startswith("components/") for k in result.files.keys())
    assert has_components, "No components generated"
    
    # Check content simple validity
    page_content = result.files["app/page.tsx"]
    if "export default" in page_content and "import" in page_content:
         print("\nSUCCESS: app/page.tsx looks valid.")
    else:
         print("\nFAILURE: app/page.tsx content invalid.")

if __name__ == "__main__":
    test_ui_agent_contract()

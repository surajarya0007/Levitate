from agents.ui_agent import UiAgent
import os
from dotenv import load_dotenv

load_dotenv()

def test_ui_agent():
    print("Initializing UI Agent...")
    agent = UiAgent()
    
    print("Generating 'Hero' component...")
    result = agent.generate_component(
        component_name="Hero",
        description="A hero section for a startup called RocketLaunch. Headline: Space travel for everyone. Subheadline: Affordable and fast. Buttons: Get Started (primary), Learn More (secondary).",
        theme="Modern space aesthetic, deep blue background, white text."
    )
    
    print("\nFilename:", result.filename)
    print("Imports:", result.imports)
    print("\nCode Snippet:\n", result.code[:200] + "...")
    
    if "export default" in result.code and "className=" in result.code:
        print("\nSUCCESS: Generated code looks valid.")
    else:
        print("\nFAILURE: Generated code missing key elements.")

if __name__ == "__main__":
    test_ui_agent()

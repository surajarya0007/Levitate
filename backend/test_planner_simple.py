import unittest
from agents.planner_agent import PlannerAgent
from agents.schemas.site_plan import SitePlan
import os
from dotenv import load_dotenv

load_dotenv()

class TestPlannerSimple(unittest.TestCase):
    def setUp(self):
        self.agent = PlannerAgent()

    def test_simple_prompt(self):
        print("\nTesting Simple Prompt...")
        prompt = "I want a landing page for my startup called 'RocketLaunch'"
        plan = self.agent.plan_website(prompt)
        print(f"Result Site Name: {plan}")
        self.assertIsInstance(plan, SitePlan)
        self.assertIn("RocketLaunch", plan.site_name)
        self.assertTrue(len(plan.pages) > 0)

if __name__ == "__main__":
    unittest.main()

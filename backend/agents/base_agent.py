from google import genai
from google.genai import types
import os
import json
import time
from pydantic import BaseModel
from typing import Type, TypeVar, Generic

T = TypeVar('T', bound=BaseModel)

class BaseAgent(Generic[T]):
    def __init__(self, model_name: str = "gemini-2.0-flash"):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")

        self.client = genai.Client(api_key=api_key)

        # Primary model + Fallbacks (Rotation)
        self.models = [
            "gemini-2.5-flash",
            "gemini-2.5-pro",
            "gemini-2.0-flash-lite"
        ]
        self.current_model_index = 0

    def _get_current_model_name(self):
        return self.models[self.current_model_index]

    def run(self, prompt: str, response_format: Type[T]) -> T:
        """
        Executes the agent with a prompt and enforces a structured response.
        """
        full_prompt = f"{self.get_system_prompt()}\n\nUser Request: {prompt}"

        max_retries = 6
        base_delay = 10

        for attempt in range(max_retries):
            try:
                model_name = self._get_current_model_name()
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=full_prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                    ),
                )
                content = response.text

                if not content:
                    raise ValueError("Empty response from LLM")

                return response_format.model_validate_json(content)

            except Exception as e:
                # Check for rate limit (429) OR NotFound (404 - model not available)
                err_str = str(e)
                if "429" in err_str or "ResourceExhausted" in err_str or "Quota exceeded" in err_str or "404" in err_str or "NotFound" in err_str:
                    print(f"Issue with {self.models[self.current_model_index]}: {e}. Rotating model...")

                    # Rotate model index
                    self.current_model_index = (self.current_model_index + 1) % len(self.models)

                    if attempt < max_retries - 1:
                        delay = base_delay * (1.5 ** attempt)
                        print(f"Retrying with {self.models[self.current_model_index]} in {delay:.1f}s...")
                        time.sleep(delay)
                        continue

                print(f"Error calling Gemini: {e}")
                raise e

    def get_system_prompt(self) -> str:
        """
        Returns the system prompt for the agent.
        Should be overridden by subclasses.
        """
        return "You are a helpful AI assistant that outputs JSON."

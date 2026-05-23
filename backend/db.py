import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

print(f"DEBUG: Loading .env from {Path(__file__).parent / '.env'}")
_SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
_SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
print(f"DEBUG: SUPABASE_URL found: {bool(_SUPABASE_URL)}")
print(f"DEBUG: SUPABASE_SERVICE_ROLE_KEY found: {bool(_SUPABASE_SERVICE_ROLE_KEY)}")

_supabase_client: Client | None = None


if _SUPABASE_URL and _SUPABASE_SERVICE_ROLE_KEY:
    try:
        _supabase_client = create_client(_SUPABASE_URL, _SUPABASE_SERVICE_ROLE_KEY)
        print("DEBUG: Supabase client initialized successfully")
    except Exception as e:
        print(f"DEBUG: Failed to initialize Supabase client: {e}")
else:
    print("DEBUG: Skipping Supabase client initialization due to missing config")


def get_supabase_client() -> Client:
    if _supabase_client is None:
        raise RuntimeError(
            "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        )
    return _supabase_client

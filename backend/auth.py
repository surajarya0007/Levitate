from typing import Any

from fastapi import Header, HTTPException, status

from db import get_supabase_client


async def get_current_user(authorization: str | None = Header(default=None)) -> Any:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    try:
        response = get_supabase_client().auth.get_user(token)
    except Exception as exc:
        print(f"Auth validation error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to validate access token",
        ) from exc

    user = getattr(response, "user", None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    # Debug: Print user ID to console
    print(f"Authenticated user: {user.id}")

    return user

from typing import Any, Optional

from celery.result import AsyncResult
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth import get_current_user
from db import get_supabase_client
from tasks import JOB_STATES, generate_website

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    prompt: str


class GenerateResponse(BaseModel):
    job_id: str


class StatusResponse(BaseModel):
    job_id: str
    status: str
    message: Optional[str] = None
    logs: Optional[str] = None
    deploy_url: Optional[str] = None
    result: Optional[dict] = None


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    job_id: str
    prompt: str
    status: str
    deploy_url: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None


def _resolve_task_snapshot(job_id: str) -> tuple[str, Optional[str], Optional[str], Optional[dict]]:
    task_result = AsyncResult(job_id)

    status = task_result.status
    if task_result.state == "PENDING":
        status = JOB_STATES["CREATED"]
    elif isinstance(task_result.info, dict) and "status" in task_result.info:
        status = task_result.info["status"]

    message: str | None = None
    logs: str | None = None
    result_data: dict | None = None

    if task_result.successful():
        result_data = task_result.result if isinstance(task_result.result, dict) else None
        if result_data:
            status = result_data.get("status", status)
            message = result_data.get("message")
            logs = result_data.get("logs") or result_data.get("build_logs")
    elif task_result.failed():
        status = JOB_STATES["FAILED"]
        message = "Generation failed"
        logs = str(task_result.result)
        result_data = {"error": str(task_result.result)}
    else:
        # In-progress: read intermediate logs from task meta
        if isinstance(task_result.info, dict):
            logs = task_result.info.get("logs")

    return status, message, logs, result_data


def _ensure_project_owner(job_id: str, user_id: str) -> None:
    project = (
        get_supabase_client()
        .table("projects")
        .select("id")
        .eq("job_id", job_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest, user: Any = Depends(get_current_user)):
    """
    Generate code based on the provided prompt.
    Starts a background Celery task and persists the project.
    """
    task = generate_website.delay(request.prompt)

    try:
        get_supabase_client().table("projects").insert(
            {
                "user_id": user.id,
                "job_id": task.id,
                "prompt": request.prompt,
                "status": JOB_STATES["CREATED"],
            }
        ).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to persist project: {exc}") from exc

    return GenerateResponse(job_id=task.id)


@app.get("/status/{job_id}", response_model=StatusResponse)
async def get_status(job_id: str, user: Any = Depends(get_current_user)):
    """
    Get the status of a generation job.
    Fetches state from Celery/Redis, and syncs it into Supabase.
    """
    _ensure_project_owner(job_id, user.id)

    status, message, logs, result_data = _resolve_task_snapshot(job_id)
    deploy_url: str | None = None

    if result_data:
        deploy_url = result_data.get("deploy_url")

    update_payload: dict[str, Any] = {"status": status}
    if deploy_url:
        update_payload["deploy_url"] = deploy_url
    if result_data is not None:
        update_payload["result"] = result_data
    if logs is not None:
        update_payload["logs"] = logs

    get_supabase_client().table("projects").update(update_payload).eq("job_id", job_id).eq(
        "user_id", user.id
    ).execute()

    return StatusResponse(
        job_id=job_id,
        status=status,
        message=message,
        logs=logs,
        deploy_url=deploy_url,
        result=result_data,
    )


@app.get("/projects", response_model=list[ProjectResponse])
async def list_projects(user: Any = Depends(get_current_user)):
    response = (
        get_supabase_client()
        .table("projects")
        .select("id,user_id,job_id,prompt,status,deploy_url,created_at,updated_at")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .execute()
    )

    projects = response.data or []
    for project in projects:
        if project["status"] in {JOB_STATES["DONE"], JOB_STATES["FAILED"]}:
            continue

        try:
            status, _message, logs, result_data = _resolve_task_snapshot(project["job_id"])
            update_payload: dict[str, Any] = {"status": status}
            if logs is not None:
                update_payload["logs"] = logs
            if result_data is not None:
                update_payload["result"] = result_data
                deploy_url = result_data.get("deploy_url")
                if deploy_url:
                    update_payload["deploy_url"] = deploy_url

            # Only update if there are changes worth updating
            # (Checking status change effectively, but simply updating is safer for consistency)
            get_supabase_client().table("projects").update(update_payload).eq("id", project["id"]).eq(
                "user_id", user.id
            ).execute()
            
            project["status"] = status
            if "deploy_url" in update_payload:
                project["deploy_url"] = update_payload["deploy_url"]
        except Exception as e:
            # Log error but don't fail the request
            print(f"Error updating project {project['id']}: {e}")

    return projects


@app.delete("/projects/{project_id}", status_code=204)
async def delete_project(project_id: str, user: Any = Depends(get_current_user)):
    """Delete a project owned by the current user."""
    result = (
        get_supabase_client()
        .table("projects")
        .delete()
        .eq("id", project_id)
        .eq("user_id", user.id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Levitate Backend API"}

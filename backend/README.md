# Backend - FastAPI + Celery

FastAPI server for AI processing and website generation.

## Quick Start

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in the required variables:
```
# Supabase (Auth & Database)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key-here

# Gemini API
GEMINI_API_KEY=your-gemini-key

# Redis (Task Queue)
REDIS_URL=redis://localhost:6379/0

# Vercel (Optional - for deployments)
VERCEL_TOKEN=your-vercel-token
```

### 4. Start Services

**Terminal 1 - Redis:**
```bash
redis-server
```

**Terminal 2 - Celery Worker:**
```bash
source venv/bin/activate
celery -A worker.celery_app worker --loglevel=info
```

**Terminal 3 - FastAPI Server:**
```bash
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /generate
Generate a website from a prompt.

**Authentication:** Required (Bearer token)

**Request:**
```bash
curl -X POST http://localhost:8000/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a coffee shop landing page"}'
```

**Response:**
```json
{
  "job_id": "abc123-def456"
}
```

### GET /status/{job_id}
Check the status of a generation job.

**Authentication:** Required (Bearer token)

**Request:**
```bash
curl http://localhost:8000/status/abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "job_id": "abc123",
  "status": "DONE",
  "deploy_url": "https://...",
  "logs": "...",
  "result": {
    "site_plan": {...},
    "build_logs": "..."
  }
}
```

### GET /projects
List all projects for the authenticated user.

**Authentication:** Required (Bearer token)

**Request:**
```bash
curl http://localhost:8000/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET /
Health check endpoint.

```bash
curl http://localhost:8000/
```

## Database Schema

The backend requires a Supabase project with the following tables.

Run this in Supabase SQL editor:

```sql
cat infra/supabase/projects.sql
```

This creates:
- `projects` table (stores generated websites)
- RLS policies (user isolation)
- Automatic timestamps

## Architecture

### FastAPI Server (`main.py`)

Handles HTTP requests:
- Authentication (Supabase Bearer token validation)
- Request routing
- Response formatting
- Project persistence

### Celery Worker (`tasks.py`, `worker.py`)

Background task processer:
- Executes `generate_website` task
- Manages pipeline stages (PLANNING → GENERATING → BUILDING → DEPLOYING)
- Updates Redis with job status
- Persists results to Supabase

### AI Agents (`agents/`)

- **BaseAgent**: LLM wrapper with model rotation & retries
- **PlannerAgent**: Analyzes prompts, creates site plans
- **UiAgent**: Generates React components
- **FixerAgent**: Auto-fixes build errors

### Build Manager (`build_manager.py`)

- Docker orchestration
- Sandboxed Next.js builds
- Resource constraints (1 CPU, 2GB RAM)
- Log capture

### Deployment Manager (`deployment_manager.py`)

- Vercel CLI integration
- Production deployments
- URL extraction

## Pipeline Stages

```
CREATED
  ↓
PLANNING (PlannerAgent)
  ↓
GENERATING (UiAgent)
  ↓
BUILDING (Docker + FixerAgent auto-heal)
  ↓
DEPLOYING (Vercel)
  ↓
DONE (or FAILED)
```

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `REDIS_URL` | Yes | Redis connection URL |
| `VERCEL_TOKEN` | No | Vercel deployment token |

## Troubleshooting

### Redis Connection Failed
```bash
# Ensure Redis is running
redis-server

# Test connection
redis-cli ping  # Should return PONG
```

### Supabase Connection Failed
- Verify credentials in `.env`
- Check project exists on supabase.com
- Run database schema SQL
- Check RLS policies are enabled

### Celery Worker Not Processing Tasks
- Check worker is running: `celery -A worker.celery_app worker --loglevel=info`
- Check Redis is connected: `redis-cli ping`
- Check log level for info messages

### Gemini API Errors
- Verify `GEMINI_API_KEY` is valid
- Check quota: https://console.cloud.google.com/
- Free tier has rate limits (~2 requests/min per model)

### Port 8000 Already in Use
```bash
lsof -i :8000
kill -9 <PID>
```

## API Documentation

When the server is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Configuration

### Model Selection

Edit `agents/base_agent.py` to change LLM models:
```python
self.models = [
    "gemini-2.0-flash",      # Primary
    "gemini-2.5-flash",      # Fallback 1
    "gemini-2.0-flash-lite"  # Fallback 2
]
```

The backend automatically rotates models on rate limits.

### Build Configuration

Edit `build_manager.py` to change Docker settings:
```python
# Resource limits
--cpus=1.0      # CPU cores
--memory=2048m  # RAM
```

### Max Retries

Edit `tasks.py` to change auto-fix retries:
```python
max_retries = 3  # FixerAgent attempts
```

## Performance

- **Planning**: ~10-30s (depends on prompt complexity)
- **Generation**: ~10-60s (depends on site complexity)
- **Building**: ~30-120s (depends on package dependencies)
- **Deploying**: ~10-60s (depends on Vercel queue)

**Total**: ~60-270 seconds (~1-4.5 minutes)

## Production Deployment

Recommended platforms:
1. **Railway.app** (easiest, PostgreSQL + Redis included)
2. **Render** (free tier available)
3. **Heroku** (requires credit card)
4. **AWS ECS** (most control)

Set environment variables and start command:
```bash
celery -A worker.celery_app worker --loglevel=info & uvicorn main:app --host 0.0.0.0 --port 8000
```

## Contributing

Please submit PRs with:
- Clear commit messages
- Tests for new features
- Updated documentation

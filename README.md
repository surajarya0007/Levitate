# Levitate - AI Website Builder

An intelligent website builder powered by AI that generates custom, production-ready websites from simple text descriptions.

## Overview

Levitate uses a multi-agent AI system (Gemini API) to:
1. **Plan** a website based on your text prompt
2. **Generate** React/TypeScript components
3. **Build** the Next.js project in a sandboxed Docker environment
4. **Deploy** to Vercel with automatic self-healing on build failures

## Project Structure

```
levitate/
├── frontend/              # Next.js 15 web application (user dashboard)
├── backend/               # FastAPI server + Celery worker (AI pipeline)
├── templates/
│   └── nextjs-landing/    # Template for generated websites
├── sandbox/               # Docker build environment
├── infra/                 # Database schema (Supabase)
└── README.md
```

## Prerequisites

Before you start, ensure you have:

- **Node.js** >= 18.x (for frontend and Next.js builds)
- **Python** >= 3.9 (for backend)
- **Docker** (for sandboxed builds)
- **Redis** (for Celery task queue)
- **Supabase Project** (for auth and database)
- **Gemini API Key** (for LLM)
- **Vercel Token** (optional, for deployments)

### Install Prerequisites

**macOS:**
```bash
# Install Node.js
brew install node

# Install Python
brew install python@3.11

# Install Docker (from Docker Desktop or)
brew install docker

# Install Redis
brew install redis
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install nodejs npm python3 python3-venv docker.io redis-server
```

**Windows:**
- Download and install [Node.js](https://nodejs.org/)
- Download and install [Python](https://www.python.org/)
- Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Install Redis via WSL or Docker

## Quick Start (5 minutes)

### 1. Clone Repository
```bash
git clone <repo-url>
cd Levitate
```

### 2. Set Up Environment Variables

Create `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Create `frontend/.env.local`:
```bash
cp frontend/.env.example frontend/.env.local
```

Edit both files with your keys:
- Get Supabase credentials from your Supabase project
- Get Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- (Optional) Get Vercel token for deployments

### 3. Set Up Database

Create the projects table:
```bash
# In Supabase SQL editor, run:
cat infra/supabase/projects.sql
```

### 4. Start Services

**Terminal 1 - Redis:**
```bash
redis-server
```

**Terminal 2 - Backend Server:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 3 - Celery Worker:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
celery -A worker.celery_app worker --loglevel=info
```

**Terminal 4 - Frontend (dev server):**
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the App

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Detailed Setup Guide

### Backend Setup

1. **Create Virtual Environment:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. **Install Dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure Environment Variables:**

Copy and edit `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Fill in these required keys:
```
# Supabase (Auth & Database)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# LLM (Google Gemini)
GEMINI_API_KEY=AIza...

# Task Queue
REDIS_URL=redis://localhost:6379/0

# Deployments (Optional)
VERCEL_TOKEN=vercel_...
```

Get these from:
- **Supabase**: Project Settings > API
- **Gemini API**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Vercel Token**: [Vercel Settings > Tokens](https://vercel.com/account/tokens)

4. **Start Services (in order):**

First, start Redis:
```bash
redis-server
```

In another terminal, start the Celery worker:
```bash
cd backend
source venv/bin/activate
celery -A worker.celery_app worker --loglevel=info
```

In a third terminal, start the FastAPI server:
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Install Dependencies:**
```bash
cd frontend
npm install
```

2. **Configure Environment Variables:**

Copy and edit `frontend/.env.local`:
```bash
cp frontend/.env.example frontend/.env.local
```

Fill in:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

3. **Start Development Server:**
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Database Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Copy the project URL and API keys from Settings > API

### Create Database Tables

In Supabase SQL editor, run:
```sql
-- Copy and paste contents of infra/supabase/projects.sql
```

This creates:
- `projects` table (stores user-generated websites)
- Row-level security (RLS) policies (user isolation)
- Automatic timestamps

## API Endpoints

### Generate a Website

Start the generation pipeline:
```bash
curl -X POST http://localhost:8000/generate \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a modern coffee shop landing page with hero section, menu highlights, and contact form"
  }'
```

**Response:**
```json
{
  "job_id": "c46d5204-3739-4cad-b584-0af98f8d9bbb"
}
```

### Check Job Status

Poll the job status:
```bash
curl http://localhost:8000/status/c46d5204-3739-4cad-b584-0af98f8d9bbb \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

**Response:**
```json
{
  "job_id": "c46d5204-3739-4cad-b584-0af98f8d9bbb",
  "status": "DONE",
  "deploy_url": "https://nextjs-landing-abc123.vercel.app",
  "logs": "...",
  "result": {
    "status": "DONE",
    "message": "Website generation complete",
    "plan": { "site_name": "Artisan Brew Co.", ... },
    "build_logs": "..."
  }
}
```

### List User Projects

```bash
curl http://localhost:8000/projects \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

### Health Check

```bash
curl http://localhost:8000/
```

## Pipeline Stages

The website generation pipeline goes through these stages:

| Stage | Status | What Happens |
|-------|--------|--------------|
| **CREATED** | Initial | Job initialized in queue |
| **PLANNING** | Running | PlannerAgent analyzes prompt, creates site plan |
| **GENERATING** | Running | UiAgent generates React components (TSX files) |
| **BUILDING** | Running | Docker builds Next.js project (npm install + build) |
| **DEPLOYING** | Running | DeploymentManager deploys to Vercel |
| **DONE** | Complete | Website live at deploy_url |
| **FAILED** | Error | Check logs for error details |

**Auto-healing**: If build fails, FixerAgent analyzes errors and fixes code (up to 3 retries).

Monitor progress by polling `/status/{job_id}` every 5-10 seconds.

## Troubleshooting

### Port Already in Use

```bash
# Find process on port 8000
lsof -i :8000

# Kill it
kill -9 <PID>

# Same for other ports
lsof -i :3000     # frontend
lsof -i :6379     # redis
```

### Supabase Connection Failed

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`
- Check that Supabase project exists
- Run `infra/supabase/projects.sql` in Supabase SQL editor
- Verify RLS policies are enabled on projects table

### Gemini API Rate Limited

- Backend automatically rotates between models: `gemini-2.0-flash`, `gemini-2.5-flash`, `gemini-2.0-flash-lite`
- Free tier has daily limits (~2 requests/minute per model)
- Consider upgrading to Gemini API paid tier
- Check quota at [Google Cloud Console](https://console.cloud.google.com/)

### Docker Build Fails

```bash
# Check Docker is running
docker ps

# Check disk space
docker system df

# Remove dangling images
docker system prune
```

View full build logs in the API response under `result.build_logs`.

### Vercel Deployment Shows 401

- Deployment succeeded but Vercel has **Deployment Protection** enabled
- Remove protection: Vercel Dashboard > Project Settings > Deployment Protection
- Or create a public environment variable to skip protection

### Redis Connection Error

```bash
# Start Redis
redis-server

# Test connection
redis-cli ping  # Should return PONG
```

### Python Dependency Errors

```bash
# Recreate virtual environment
rm -rf backend/venv
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

### npm Install Fails

```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

## Development Workflow

1. **Make code changes** in `backend/` or `frontend/` directories
2. **Restart affected services**:
   - Backend changes: restart FastAPI server (Ctrl+C, run again)
   - Frontend changes: auto-reload on save (no restart needed)
   - Celery changes: restart worker
3. **Test in browser**: http://localhost:3000
4. **Test API**: http://localhost:8000/docs (SwaggerUI)

## Production Deployment

### Frontend (Vercel)

```bash
cd frontend

# Build locally to test
npm run build
npm start

# Deploy to Vercel (requires vercel CLI)
npm i -g vercel
vercel

# Or connect GitHub repo in Vercel Dashboard
```

### Backend (Railway, Render, or AWS)

**Railway** (easiest):
1. Connect GitHub to Railway
2. Create new service from repo
3. Set environment variables
4. Deploy

**Environment Variables Needed:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REDIS_URL` (use Railway Redis service)
- `GEMINI_API_KEY`
- `VERCEL_TOKEN`

**Start Command:**
```bash
celery -A worker.celery_app worker --loglevel=info & uvicorn main:app --host 0.0.0.0 --port 8000
```

## Features

- ✅ AI-powered website generation from text prompts
- ✅ Multi-agent LLM orchestration (Plan → Generate → Build → Deploy)
- ✅ Sandboxed Docker builds (resource-limited, safe execution)
- ✅ Auto-healing with AI-powered code fixes
- ✅ One-click Vercel deployments
- ✅ User authentication (Supabase Auth)
- ✅ Project persistence and history
- ✅ TypeScript + React best practices
- ✅ Responsive Tailwind CSS designs
- ✅ Real-time job status polling

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Supabase Auth
- **Backend**: FastAPI, Python, Celery, Redis
- **AI**: Google Gemini (2.0-flash, 2.5-flash)
- **Build & Sandbox**: Docker
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Task Queue**: Celery + Redis

## File Structure (Key Files)

```
backend/
├── main.py                  # FastAPI app & endpoints
├── tasks.py                 # Celery task definition
├── worker.py                # Celery app config
├── auth.py                  # Supabase auth middleware
├── db.py                    # Supabase client
├── build_manager.py         # Docker build orchestration
├── deployment_manager.py    # Vercel deployment
├── agents/
│   ├── base_agent.py        # LLM base class + model rotation
│   ├── planner_agent.py     # Site planning agent
│   ├── ui_agent.py          # Code generation agent
│   ├── fixer_agent.py       # Auto-fix agent
│   └── schemas/             # Pydantic models
└── requirements.txt         # Python dependencies

frontend/
├── app/                     # Next.js 15 App Router
│   ├── page.tsx            # Home page
│   ├── signin/             # Sign in page
│   ├── signup/             # Sign up page
│   └── projects/           # User projects dashboard
├── components/             # React components
└── utils/                  # Helper functions

infra/
└── supabase/
    └── projects.sql        # Database schema
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# Frontend - Next.js 15 Dashboard

User dashboard for Levitate AI website builder.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the required variables:
```
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Supabase (Auth & Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Authentication**: Sign up / Sign in via Supabase Auth
- **Dashboard**: View all generated projects
- **Project Generation**: Submit prompts to create websites
- **Real-time Status**: Poll job status and see live URLs
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/signin` | Sign in page |
| `/signup` | Sign up page |
| `/projects` | Dashboard (view all user projects) |

## Project Structure

```
frontend/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home (landing)
│   ├── signin/
│   │   └── page.tsx             # Sign in page
│   ├── signup/
│   │   └── page.tsx             # Sign up page
│   └── projects/
│       └── page.tsx             # Projects dashboard
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Top navigation
│   │   └── Footer.tsx          # Footer
│   └── sections/
│       ├── Hero.tsx             # Landing hero section
│       ├── Features.tsx         # Features section
│       └── ...
│
├── utils/
│   ├── api.ts                   # API client functions
│   └── supabase.ts              # Supabase client setup
│
├── public/                       # Static assets
├── package.json
└── .env.example
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Next.js dev server with hot reload.

### Production Build
```bash
npm run build
npm start
```
Build for production and start server.

### Linting
```bash
npm run lint
```
Run ESLint to check code quality.

## Authentication Flow

1. **Sign Up** (`/signup`)
   - User creates account with email + password
   - Supabase handles auth
   - Session stored in browser

2. **Sign In** (`/signin`)
   - User logs in with email + password
   - Session authenticated

3. **Dashboard** (`/projects`)
   - Protected route - requires auth
   - Displays user's generated projects
   - Shows status, deploy URLs, timestamps

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |

**Note:** Variables starting with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets here.

## API Integration

The frontend communicates with the backend via `utils/api.ts`:

### Generate Website
```typescript
const response = await fetch('http://localhost:8000/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ prompt: 'Create a landing page' })
});
const { job_id } = await response.json();
```

### Check Job Status
```typescript
const status = await fetch(`http://localhost:8000/status/${job_id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const result = await status.json();
// result.status = 'PLANNING' | 'GENERATING' | 'BUILDING' | 'DEPLOYING' | 'DONE'
// result.deploy_url = 'https://...' (when DONE)
```

### List Projects
```typescript
const projects = await fetch('http://localhost:8000/projects', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await projects.json();
```

## Styling

- **Framework**: Tailwind CSS
- **Colors**: Defined in `tailwind.config.js`
- **Typography**: Inter font family
- **Responsive**: Mobile-first approach

## Supabase Setup

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Copy project URL and anon key
3. Create environment variable in `.env.local`
4. Database auto-synced with backend

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Or connect GitHub repo:
1. Go to [vercel.com](https://vercel.com)
2. Import project
3. Set environment variables
4. Deploy

### Docker

```bash
docker build -t levitate-frontend .
docker run -p 3000:3000 levitate-frontend
```

### Other Platforms

- **Netlify**: Drag & drop build folder
- **Railway.app**: Connect GitHub repo
- **Render**: Connect GitHub repo

## Troubleshooting

### Port 3000 Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### API Connection Failed
- Check `NEXT_PUBLIC_API_BASE_URL` is correct
- Verify backend server is running on port 8000
- Check CORS settings in backend

### Supabase Auth Failing
- Verify `NEXT_PUBLIC_SUPABASE_URL` and anon key are correct
- Check Supabase project exists
- Confirm auth policies in Supabase

### Build Failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Hot Reload Not Working
- Restart dev server: `npm run dev`
- Check file permissions
- Clear `.next` folder: `rm -rf .next`

## Performance Tips

- Use Next.js Image component for optimized images
- Lazy load heavy components with `dynamic()` import
- Implement pagination for large lists
- Cache API responses with SWR or React Query

## Contributing

- Follow existing code style
- Use TypeScript for type safety
- Test responsive design at multiple breakpoints
- Update docs for new features

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth
- **API**: Fetch API
- **Icons**: Lucide React (included in generated templates)

## License

MIT

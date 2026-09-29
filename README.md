# AyurCTMS

AyurCTMS is a Next.js prototype for an Ayurveda clinical-trial management dashboard.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Required environment variables

Add these in Vercel and Render as needed:

```env
NEXT_PUBLIC_APP_NAME=AyurCTMS
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
API_BASE_URL=http://localhost:8000
```

For production deployment:

- Vercel frontend: set `NEXT_PUBLIC_API_BASE_URL` to your Render backend URL
- Render backend: set `API_BASE_URL` and `PORT` as required by your service
- Keep secrets out of the repo

## Vercel deployment

1. Import the GitHub repo into Vercel.
2. Set the project root to this app folder.
3. Add environment variables in Vercel Project Settings > Environment Variables.
4. Set `NEXT_PUBLIC_API_BASE_URL` to the Render API URL.
5. Deploy.

## Render deployment

1. Create a backend service (FastAPI, Node, or other API service).
2. Set the service URL in Vercel as `NEXT_PUBLIC_API_BASE_URL`.
3. If the backend uses CORS, allow the Vercel domain in the backend config.
4. Test the health endpoint using the deployed URL.

## Health check

The app exposes a simple endpoint at `/api/health` for deployment verification.

## Important note

This frontend does not connect to a backend unless an API URL is configured. Without the environment variables, Vercel and Render deployments will not know where to talk to each other.

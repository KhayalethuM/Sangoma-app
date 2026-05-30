# Sangoma App

A web platform to connect people with traditional sangoma healers and preserve African herbal heritage.

## Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Deployment**: Vercel (auto-deploy on push to `main`)
- **CI/CD**: GitHub Actions
- **Database** (next): Supabase
- **ML Model** (next): scikit-learn symptom recommender → FastAPI → Hugging Face Spaces

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages
- `/` — Homepage
- `/sangomas` — Find a sangoma near you
- `/recipes` — Traditional herb remedy library
- `/recommender` — Symptom-based herb guide (ML model placeholder)

## CI/CD
Every push to `main` triggers GitHub Actions:
1. Lint check
2. TypeScript type check
3. Production build

If all pass, Vercel auto-deploys.

## Deploying to Vercel
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Connect your GitHub repo — done. Every push to `main` auto-deploys.

## Agile Board
Use GitHub Projects (kanban) to track sprints. See the roadmap we planned.

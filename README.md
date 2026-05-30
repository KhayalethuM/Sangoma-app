# Sangoma App

A bilingual (English / isiZulu) web platform to connect people with traditional sangoma healers and explore African herbal remedies.

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Node.js + Express 4 |
| Templates | EJS |
| Styling | Tailwind CSS v3 (CDN) |
| Database | Firebase Firestore |
| i18n | URL-prefix routing (`/en/`, `/zu/`) |
| CI/CD | GitHub Actions |

## Pages

| Route | Description |
|---|---|
| `/:lang/` | Homepage |
| `/:lang/sangomas` | Find a sangoma (live DB) |
| `/:lang/recipes` | Herb remedy library |
| `/:lang/recommender` | Symptom → herb guide |
| `/:lang/register` | Sangoma sign-up form |

## Local Development

### 1. Firebase setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project**
2. Enable **Firestore Database** (start in test mode for development)
3. Go to **Project Settings → Service Accounts → Generate new private key**
4. Download the JSON file

### 2. Environment variable

```bash
cp .env.example .env
```

Open `.env` and paste the downloaded JSON as a **single line** (no line breaks) as the value of `FIREBASE_SERVICE_ACCOUNT`.

### 3. Install & run

```bash
npm install
node db/seed.js   # one-time: seeds 6 sangomas into Firestore
npm run dev       # starts server with auto-reload on http://localhost:3000
```

### 4. Approve new registrations

Sangomas who sign up via `/register` are stored with `status: "pending"`. To approve them:

- Open **Firebase Console → Firestore Database → sangomas collection**
- Find the document → change `status` from `pending` to `approved`

---

## Hosting on Render *(recommended for Express)*

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repository
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
5. Under **Environment Variables**, add:
   - `FIREBASE_SERVICE_ACCOUNT` → paste your service account JSON as a single line
6. Click **Deploy**

Render's free tier spins down after 15 min of inactivity (cold start ~30s). Upgrade to a paid plan for always-on.

---

## Hosting on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Leave build settings as-is (`vercel.json` handles routing)
4. Under **Environment Variables**, add:
   - `FIREBASE_SERVICE_ACCOUNT` → paste your service account JSON as a single line
5. Click **Deploy**

> **Note:** Vercel runs Express as a serverless function. Static files in `public/` are served through the function. For high-traffic use, Render is a better fit.

---

## CI/CD

Every push to `main` triggers GitHub Actions:
1. `npm ci` — install dependencies
2. `npm run build` — no-op (no build step needed)

3. Production build

If all pass, Vercel auto-deploys.

## Deploying to Vercel
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Connect your GitHub repo — done. Every push to `main` auto-deploys.

## Agile Board
Use GitHub Projects (kanban) to track sprints. See the roadmap we planned.

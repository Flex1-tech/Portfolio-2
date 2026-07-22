# Portfolio — Seth N. AKPLOGAN

> **AI & Data Science Student** — Full-stack portfolio with a headless CMS, built with React 19, Express, and PostgreSQL (Supabase).

[![CI](https://github.com/Flex1-tech/Portfolio-2/actions/workflows/ci.yml/badge.svg)](https://github.com/Flex1-tech/Portfolio-2/actions/workflows/ci.yml)

---

## Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript 5.9, Vite 7, React Router 7, TanStack Query 5 |
| **Styling** | Tailwind CSS 3, GSAP 3, Lenis |
| **Backend** | Node.js 22, Express 4, TypeScript 5 |
| **Database** | PostgreSQL via Supabase |
| **Auth** | express-session + connect-pg-simple + BCrypt |
| **Images** | Cloudinary (upload + auto-optimization) |
| **SEO** | react-helmet-async, Schema.org JSON-LD, sitemap.xml |
| **Tests** | Vitest + Supertest |
| **CI/CD** | GitHub Actions |

---

## Project Structure

```
Portfolio/
├── server/                     # Backend — Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── config/             # Database pool (Supabase)
│   │   ├── models/             # Data access layer (ProjectModel, ArticleModel…)
│   │   ├── routes/             # REST API endpoints + /sitemap.xml
│   │   ├── middleware/         # Auth, validation, sanitization, upload (Cloudinary)
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── types/              # TypeScript interfaces
│   │   └── tests/              # Vitest integration + unit tests
│   ├── vitest.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── Portfolio/app/              # Frontend — React + Vite
│   ├── src/
│   │   ├── App.tsx             # Routes with React.lazy() code splitting
│   │   ├── pages/              # Articles, ArticleDetail, Admin (lazy-loaded)
│   │   ├── sections/           # Hero, About, Skills, Projects, Certifications…
│   │   ├── components/         # Reusable UI components (SEO, Navigation…)
│   │   ├── services/api.ts     # API client
│   │   ├── lib/cloudinary.ts   # Cloudinary URL optimization utility
│   │   ├── context/            # ActiveSectionContext
│   │   └── hooks/              # useReducedMotion, useCharacterReveal…
│   ├── public/robots.txt
│   ├── vite.config.ts          # Manual chunk splitting
│   └── package.json
│
├── .github/workflows/ci.yml    # GitHub Actions CI pipeline
└── README.md
```

---

## Quick Start

**Prerequisites:** Node.js 22, a Supabase project (PostgreSQL), a Cloudinary account.

### 1 — Backend

```bash
cd server
npm install
cp .env.example .env        # Fill in DATABASE_URL, SESSION_SECRET, Cloudinary vars
npm run migrate             # Create tables in PostgreSQL
npm run init-admin          # Create the first admin account
npm run dev                 # Start on http://localhost:5000
```

### 2 — Frontend

```bash
cd Portfolio/app
npm install
npm run dev                 # Start on http://localhost:3000
```

### Access

| URL | Description |
|---|---|
| `http://localhost:3000` | Public portfolio |
| `http://localhost:3000/articles` | Blog articles |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:3000/admin/dashboard` | CMS dashboard |
| `http://localhost:5000/api/projects` | API (example) |
| `http://localhost:5000/sitemap.xml` | Dynamic sitemap |

---

## Environment Variables

### Backend (`server/.env`)

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://...          # Supabase connection string
SESSION_SECRET=your-secret-here        # Min 32 chars, random

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:3000
```

### Frontend (`Portfolio/app/.env.local`)

Not required for development — the Vite proxy forwards `/api` and `/admin-api` to `localhost:5000` automatically.

---

## Admin Dashboard

The CMS dashboard allows full management of all portfolio content:

- **Projects** — CRUD, image/video upload, reordering, Cloudinary integration
- **Certifications** — CRUD, logo upload, credential URL
- **Events** — CRUD, reordering
- **Articles** — CRUD, Markdown content, SEO fields, image upload
- **Profile** — Dynamic hero text, bio, social links, CV upload
- **Admins** — Multi-admin management (with self-deletion protection)
- **Security** — Password change

---

## API Reference

### Public Endpoints

```
GET  /health                          # Server status
GET  /sitemap.xml                     # Dynamic XML sitemap
GET  /api/projects                    # All projects
GET  /api/projects?page=1&limit=10   # Paginated
GET  /api/certifications              # All certifications
GET  /api/events                      # All events
GET  /api/articles                    # Published articles
GET  /api/articles/:slug              # Article by slug
GET  /api/profile                     # Public profile settings
```

### Admin Endpoints (session required)

```
POST /admin/login
POST /admin/logout
GET  /admin/session

POST   /admin/projects
PUT    /admin/projects/:id
DELETE /admin/projects/:id

POST   /admin/articles
PUT    /admin/articles/:id
DELETE /admin/articles/:id

# Same pattern for /admin/certifications, /admin/events
# POST /admin/profile  — Update profile settings
# POST /admin/admins   — Create admin account
```

---

## Security

- **Sessions** — HttpOnly cookies, persisted in PostgreSQL (`connect-pg-simple`)
- **Rate limiting** — `express-rate-limit` on login routes
- **Passwords** — BCrypt (10 rounds)
- **Headers** — `helmet()` (CSP, X-Frame-Options, etc.)
- **Validation** — Zod schemas on all write endpoints
- **Sanitization** — XSS stripping middleware on all inputs
- **CORS** — Explicit allowlist

---

## Performance

### Bundle splitting (Vite `manualChunks`)

| Chunk | Size (Gzip) | Loaded |
|---|---|---|
| `index-*.js` (homepage) | **84 KB** | Always |
| `admin-*.js` | 41 KB | `/admin/*` only |
| `markdown-*.js` | 36 KB | `/articles/*` only |
| `gsap-*.js` | 45 KB | Homepage (deferred) |
| `radix-*.js` | 31 KB | On demand |

Public visitors load **84 KB Gzip** instead of 252 KB — a **66% reduction** on first visit.

### Cloudinary image optimization

All displayed images use automatic transformations via `src/lib/cloudinary.ts`:
- `f_auto` — WebP or AVIF based on browser support
- `q_auto` — Smart quality compression
- Dimension constraints per context (thumbnails, heroes, logos)

### Caching

All public API calls are cached client-side via **TanStack Query** with a 5-minute `staleTime`. Navigation between sections is instant after the first load.

---

## SEO

- Dynamic `<title>` and `<meta name="description">` via `react-helmet-async`
- Open Graph + Twitter Cards on all pages
- Schema.org JSON-LD (`Person`, `ProfilePage`, `TechArticle`)
- `public/robots.txt` (blocks `/admin/*` from indexing)
- Dynamic `/sitemap.xml` generated from live database content

---

## Tests

```bash
# Run all tests
cd server && npm test

# Verbose output
npm test -- --reporter=verbose
```

**Current coverage: 51 tests across 3 test files**

| File | Tests | Type |
|---|---|---|
| `api.test.ts` | 4 | Integration (requires DB) |
| `validation.test.ts` | 32 | Unit (Zod schemas, in-memory) |
| `middleware.test.ts` | 15 | Unit (mock req/res) |

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR to `main` / `develop`:

1. Install frontend dependencies → `npm ci`
2. Build frontend → `npm run build` (fails on TypeScript errors)
3. Install backend dependencies → `npm ci`
4. Build backend → `npm run build` (fails on TypeScript errors)
5. Run unit tests → `npm test`

---

## Production Deployment

The application is deployed on **Render** (backend) + **Render Static** (frontend).

### Backend checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set `DATABASE_URL` (Supabase connection string with `?sslmode=require`)
- [ ] Set `SESSION_SECRET` (min 32 chars)
- [ ] Set Cloudinary env vars
- [ ] Set `CORS_ORIGIN` to the frontend production URL
- [ ] Run `npm run build` then `npm run start`

### Frontend checklist

- [ ] Verify `vite.config.ts` proxy is not used in production (Render rewrites handle `/api`)
- [ ] Run `npm run build`
- [ ] Deploy the `dist/` folder

---

## Troubleshooting

**Port already in use**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**Database connection error**
- Verify `DATABASE_URL` in `server/.env`
- Ensure Supabase project is active and connection string is correct

**CORS errors in browser**
- Verify `CORS_ORIGIN` in `server/.env` matches the frontend URL exactly (no trailing slash)

**Session lost after restart**
- Sessions are persisted in PostgreSQL — verify the `session` table was created by `npm run migrate`

**Admin login fails**
- Re-run `npm run init-admin` to reset credentials

---

## License

MIT — Created by Seth N. AKPLOGAN

---

**Last Updated**: 2026-07-22
**Status**: Production Ready — v2.0.0

# DevTrackr — 7-Step Implementation Plan

> **Goal**: Build a production-ready, full-stack AI-powered GitHub Analytics dashboard and push it to GitHub. Each step is self-contained and ends with a working, committable state.

---

## Overview

```
Step 1 → Project Scaffold & Config
Step 2 → Backend Foundation (Express + MongoDB + Auth)
Step 3 → GitHub Integration & Data Sync
Step 4 → Analytics Engine
Step 5 → AI Analysis Engine + PDF Reports
Step 6 → Full Frontend (Landing → Auth → Dashboard → All Pages)
Step 7 → Polish, README, .env docs, GitHub Push
```

---

## Step 1 — Project Scaffold & Config

**Goal**: Initialize both projects, install all dependencies, wire up configs. Commit: `chore: project scaffold`

### Tasks

#### Repository Setup
- Create `devtrackr/` root directory
- `git init` at root
- Create `.gitignore` at root (ignore `node_modules/`, `.env`, `dist/`, `.DS_Store`)
- Create root `README.md` (placeholder)

#### Backend Scaffold
- Create `backend/` directory
- Generate `backend/package.json` with `"type": "module"` and all dependencies listed in prompt
- `npm install` inside backend
- Create `backend/.env.example` with all required env vars
- Create `backend/.env` (user fills in values)
- Create `backend/src/server.js` (skeleton — starts listening, no routes yet)
- Create `backend/src/config/env.js` — validates all required env vars on startup, throws if missing
- Create `backend/src/config/db.js` — mongoose connect with error logging

#### Frontend Scaffold
- Create `frontend/` directory
- `npm create vite@latest frontend -- --template react` (non-interactive)
- Install all deps: `npm install react-router-dom axios recharts framer-motion`
- Install all devDeps: `npm install -D tailwindcss autoprefixer postcss`
- `npx tailwindcss init -p`
- Create `frontend/tailwind.config.js` with full design system colors + fonts
- Create `frontend/src/index.css` with Tailwind directives + glass-card utility + scrollbar styles
- Create `frontend/index.html` with Google Fonts CDN link (JetBrains Mono + Inter)
- Create `frontend/vite.config.js` with `@vitejs/plugin-react`
- Create `frontend/.env.example` and `frontend/.env`

#### Deliverable
Both `npm run dev` (frontend) and `npm run dev` (backend) start without errors.

---

## Step 2 — Backend Foundation: Auth System

**Goal**: Full JWT authentication API. Commit: `feat: auth system — signup, login, JWT, middleware`

### Tasks

#### Mongoose Models
- `backend/src/models/User.model.js` — full schema with all fields
- `backend/src/models/Repository.model.js`
- `backend/src/models/Commit.model.js`
- `backend/src/models/PullRequest.model.js`
- `backend/src/models/Issue.model.js`
- `backend/src/models/AIReport.model.js`

#### Utilities
- `backend/src/utils/jwtHelper.js` — `generateToken(payload)`, `verifyToken(token)`
- `backend/src/utils/bcryptHelper.js` — `hashPassword(pw)`, `comparePassword(pw, hash)`

#### Middleware
- `backend/src/middleware/auth.middleware.js` — extract Bearer token, verify JWT, attach `req.user`
- `backend/src/middleware/errorHandler.js` — global Express error handler, formats `{ success: false, message }`
- `backend/src/middleware/rateLimiter.js` — 100 req/15 min per IP
- `backend/src/middleware/validateRequest.js` — express-validator error collector

#### Auth Layer
- `backend/src/services/auth.service.js` — business logic: createUser, findByEmail, validatePassword
- `backend/src/controllers/auth.controller.js` — signup, login, logout, getMe, forgotPassword, resetPassword
- `backend/src/routes/auth.routes.js` — mount all auth endpoints
- Wire into `server.js`: mount `/api/auth`, attach middleware chain

#### Deliverable
Test with curl/Postman: POST `/api/auth/signup` → returns JWT. POST `/api/auth/login` → returns JWT. GET `/api/auth/me` with Bearer token → returns user.

---

## Step 3 — GitHub Integration & Data Sync

**Goal**: OAuth flow, repo fetching, full data sync to MongoDB. Commit: `feat: GitHub OAuth, repo sync pipeline`

### Tasks

#### GitHub Config
- `backend/src/config/githubOAuth.js` — exports `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, token exchange URL

#### GitHub Service (core)
- `backend/src/services/github.service.js`:
  - `getUserRepos(token)` — list repos via Octokit
  - `getRepoCommits(token, owner, repo, since)` — with exponential backoff retry
  - `getRepoPullRequests(token, owner, repo)` — fetch open + closed
  - `getRepoIssues(token, owner, repo)` — fetch open + closed
  - `getRepoContributors(token, owner, repo)`
- `backend/src/utils/githubHelpers.js` — `retry(fn, maxRetries)`, `sleep(ms)`, `buildOctokit(token)`

#### GitHub Controller + Routes
- `backend/src/controllers/github.controller.js`:
  - `connectGitHub` — exchange OAuth code, fetch GitHub profile, save to User
  - `getRepos` — get user's repos from GitHub API
  - `addRepo` — save repo to DB + add to user.repositories
  - `syncRepo` — bulk upsert commits/PRs/issues, update lastSynced
- `backend/src/routes/github.routes.js` — all `/api/github/*` endpoints (all protected)
- Wire into `server.js`

#### Background Jobs
- `backend/src/jobs/syncRepoData.job.js` — cron every 6h, syncs all repos
- `backend/src/jobs/inactivityCheck.job.js` — cron 9am daily, logs inactive contributors
- Start jobs from `server.js` on startup

#### Deliverable
Can connect GitHub account, add a repo, sync data — commits/PRs/issues appear in MongoDB.

---

## Step 4 — Analytics Engine

**Goal**: All analytics computed from DB data, served via REST API. Commit: `feat: analytics service and API`

### Tasks

#### Analytics Service
- `backend/src/utils/productivityScore.js` — `calcScore(commits, prs, issues)` normalizer
- `backend/src/services/analytics.service.js`:
  - `getCommitAnalytics(repoId)` — daily/weekly/monthly aggregations via MongoDB `$group`
  - `getPRAnalytics(repoId)` — open/closed/merged counts, merge rate, avg merge time
  - `getIssueAnalytics(repoId)` — open/closed, avg resolution time, top labels
  - `getContributorAnalytics(repoId)` — per-contributor stats + productivity scores + inactive flag

#### Analytics Controller + Routes
- `backend/src/controllers/analytics.controller.js` — handlers for each analytics endpoint
- `backend/src/routes/analytics.routes.js`:
  - GET `/api/analytics/commits?repoId=`
  - GET `/api/analytics/pullrequests?repoId=`
  - GET `/api/analytics/issues?repoId=`
  - GET `/api/analytics/contributors?repoId=`
  - GET `/api/analytics/overview?repoId=` (all 4 combined)

#### Deliverable
All analytics endpoints return structured data matching the spec. Productivity scores calculated correctly.

---

## Step 5 — AI Analysis Engine + PDF Reports

**Goal**: Claude AI analysis + PDF export pipeline. Commit: `feat: AI analysis (Claude) + PDF report generation`

### Tasks

#### AI Module
- `backend/src/ai/openaiClient.js` — Anthropic client init with API key from env
- `backend/src/ai/promptBuilder.js` — `buildAnalysisPrompt(repoData)` as specified in prompt
- `backend/src/ai/responseParser.js` — `parseAIResponse(rawText)` strips fences, JSON.parse

#### AI Service + Controller + Routes
- `backend/src/services/ai.service.js`:
  - Fetch all analytics + repo data from DB
  - Build prompt → call Claude claude-sonnet-4-20250514 → parse response → save AIReport → return
- `backend/src/controllers/ai.controller.js` — `analyzeRepo`, `getReport`
- `backend/src/routes/ai.routes.js`:
  - POST `/api/ai/analyze` — triggers analysis
  - GET `/api/ai/report/:repoId` — returns latest report

#### PDF Report Service + Route
- `backend/src/services/report.service.js` — pdfkit pipeline:
  - Header: "DevTrackr" gradient-style text + date
  - Repo info section
  - AI Summary paragraph
  - Large productivity score
  - Tables: commits, PRs, issues stats
  - Contributors table
  - AI Recommendations numbered list
  - Bottlenecks section
  - Footer
- `backend/src/controllers/report.controller.js` — assembles data, streams PDF
- `backend/src/routes/report.routes.js`:
  - GET `/api/reports/pdf/:repoId`

#### Deliverable
POST `/api/ai/analyze` → returns full JSON report. GET `/api/reports/pdf/:repoId` → downloads a working PDF.

---

## Step 6 — Full Frontend Implementation

**Goal**: Complete React application — all pages, components, charts, contexts wired together. Commit: `feat: complete frontend — all pages, charts, AI insights, auth`

### Sub-steps (build in this order)

#### 6a — Foundation
- `frontend/src/utils/axiosInstance.js` — Axios with request/response interceptors
- `frontend/src/utils/formatDate.js`, `constants.js`, `calcProductivityScore.js`
- All API files: `auth.api.js`, `github.api.js`, `analytics.api.js`, `ai.api.js`, `reports.api.js`

#### 6b — Contexts & Hooks
- `AuthContext.jsx` — user, token, isAuthenticated, login/signup/logout/loadUser
- `GitHubContext.jsx` — repos, selectedRepo, fetchRepos/selectRepo/addRepo/syncRepo
- `ThemeContext.jsx` — dark/light toggle
- Custom hooks: `useAuth.js`, `useGitHub.js`, `useAnalytics.js`, `useAIReport.js`, `useTheme.js`

#### 6c — Common Components
- `Button.jsx`, `Card.jsx`, `Badge.jsx`, `Modal.jsx`, `Spinner.jsx`, `Avatar.jsx`, `Tooltip.jsx`, `EmptyState.jsx`
- `Toast.jsx` — bottom-right notification, auto-dismiss 4s, Framer Motion slide-in

#### 6d — Routing & Layouts
- `frontend/src/routes/AppRoutes.jsx` — BrowserRouter, all routes, ProtectedRoute HOC
- `frontend/src/layouts/AuthLayout.jsx` — centered card on gradient mesh background
- `frontend/src/layouts/DashboardLayout.jsx` — Sidebar + top Navbar, responsive collapse

#### 6e — Layout Components
- `Sidebar.jsx` — logo, nav links (active states), repo selector, user area + logout
- `Navbar.jsx` — page title, search bar, notification bell, user dropdown, "Connect GitHub" btn
- `Footer.jsx`, `PageWrapper.jsx` (Framer Motion page transition wrapper)

#### 6f — Auth Pages
- `LoginPage.jsx` — dark glassmorphism card, email+password, loading spinner, error toast
- `SignupPage.jsx` — name+email+password, password strength indicator, terms checkbox
- `ForgotPasswordPage.jsx` — email input, success message with reset token display
- Auth components: `LoginForm.jsx`, `SignupForm.jsx`, `ForgotPasswordForm.jsx`

#### 6g — Landing Page
- `LandingPage.jsx` — full sections:
  - **Hero**: Animated gradient BG, headline with gradient text, 2 CTA buttons, glassmorphism dashboard mockup
  - **Features**: 6-card grid with Framer Motion hover lift
  - **Stats**: 3 animated counters (count-up on scroll via IntersectionObserver)
  - **How It Works**: 4-step flow with connecting line
  - **Footer**: Logo, tagline, links

#### 6h — Charts
- `CommitBarChart.jsx` — BarChart with dark theme, custom tooltip
- `PRPieChart.jsx` — PieChart with custom legend
- `IssueLineChart.jsx` — LineChart (opened vs closed)
- `ContributorRadarChart.jsx` — RadarChart per contributor
- `SprintVelocityChart.jsx` — BarChart weekly velocity
- `CommitHeatmap.jsx` — CSS Grid GitHub-style heatmap

#### 6i — GitHub Components
- `ConnectGitHub.jsx` — centered card, GitHub OAuth redirect button
- `RepoCard.jsx` — repo name, language badge, stars/forks, sync button, view analytics link
- `RepoSelector.jsx` — dropdown in sidebar for switching repos
- `GitHubCallback.jsx` — route page that reads `?code=`, calls API, redirects

#### 6j — Dashboard Components
- `StatCard.jsx` — glassmorphism card with icon, large mono value, trend badge
- `AIInsightCard.jsx` — accent-bordered card with skeleton loader
- `BottleneckAlert.jsx`, `SprintSummaryCard.jsx`, `ActivityFeed.jsx`

#### 6k — Protected Pages
- `DashboardPage.jsx` — stat row + 4 charts + AI insights row + sprint velocity chart
- `RepositoriesPage.jsx` — repo grid, add/sync buttons, ConnectGitHub gate
- `AIInsightsPage.jsx` — full AI report view, productivity score gauge, bottlenecks, recommendations
- `ReportsPage.jsx` — report history grid, download PDF button
- `SettingsPage.jsx` — tabbed: Profile | GitHub | Security | Preferences

#### 6l — Report Components
- `ReportPreview.jsx`, `ExportButton.jsx`

#### 6m — Wire Everything
- `main.jsx` → wrap App in AuthProvider + ThemeProvider + GitHubProvider
- `App.jsx` → `<AppRoutes />`
- Verify all imports are correct, no circular deps

#### Deliverable
Full app runs on `npm run dev`. All pages render. Auth flow works. GitHub connect flow works. Charts render with live data.

---

## Step 7 — Polish, README & GitHub Push

**Goal**: Production-ready code, documented, pushed to GitHub. Commit: `docs: README, env docs, final polish`

### Tasks

#### Code Polish
- Add Framer Motion page transitions to all route changes
- Mobile responsive: sidebar collapses to bottom nav on mobile, icon-only on tablet
- All Recharts wrapped in `<ResponsiveContainer>`
- All async calls have try/catch + Toast error display
- Loading skeletons (`animate-pulse`) for all data-fetching states
- Empty states with CTAs for all pages

#### Environment & Config Cleanup
- Finalize `backend/.env.example` (all vars documented with descriptions)
- Finalize `frontend/.env.example`
- Validate all env vars on startup in `backend/src/config/env.js`

#### README.md (root)
Write full README with:
- Project overview + screenshots section placeholder
- Tech stack table
- Local development setup (step-by-step):
  1. Clone repo
  2. `cd backend && npm install && cp .env.example .env` (fill in values)
  3. `cd frontend && npm install && cp .env.example .env` (fill in values)
  4. Required services: MongoDB Atlas, GitHub OAuth App, Anthropic API key
  5. `npm run dev` in both directories
- GitHub OAuth setup instructions (how to create OAuth App on GitHub)
- API documentation (brief endpoint list)
- Deployment guide (Vercel for frontend, Render for backend, MongoDB Atlas)
- Contributing guide

#### GitHub Push
```bash
git add .
git commit -m "feat: initial DevTrackr full-stack implementation"
git remote add origin https://github.com/<your-username>/devtrackr.git
git branch -M main
git push -u origin main
```

---

## Execution Timeline

| Step | Estimated Effort | Git Commit Tag |
|------|-----------------|----------------|
| 1. Scaffold & Config | ~20 min | `chore: scaffold` |
| 2. Auth System | ~30 min | `feat: auth` |
| 3. GitHub Integration | ~40 min | `feat: github-sync` |
| 4. Analytics Engine | ~30 min | `feat: analytics` |
| 5. AI + PDF | ~30 min | `feat: ai-reports` |
| 6. Full Frontend | ~90 min | `feat: frontend` |
| 7. Polish + Push | ~20 min | `docs: readme` |

**Total**: ~4.5 hours of focused work

---

## Prerequisites Before Starting

> [!IMPORTANT]
> Have these ready BEFORE Step 1:
> - **MongoDB Atlas** account + cluster URI (`MONGO_URI`)
> - **GitHub OAuth App** created at github.com/settings/developers → get `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` (set callback URL to `http://localhost:5000/api/github/callback`)
> - **Anthropic API Key** (`ANTHROPIC_API_KEY`) from console.anthropic.com
> - **Node.js 18+** installed
> - **Git** configured with your GitHub account

---

## Open Questions

> [!NOTE]
> These design decisions have been pre-resolved in favor of the prompt spec, but confirm if you want changes:
> - **Demo mode**: Should the landing page work without auth (demo dashboard)? Currently plan is: "View Demo" → `/dashboard` which redirects to login if unauthenticated.
> - **GitHub OAuth callback URL**: Plan uses `http://localhost:5000/api/github/callback` for dev. Change for production?
> - **MongoDB hosting**: Plan assumes MongoDB Atlas (cloud). Local MongoDB also works — just change `MONGO_URI`.
> - **Light mode**: ThemeContext has toggle but MVP is dark-only. OK to defer light mode?

---

## Verification Plan

After all steps complete:
1. ✅ `npm run dev` works in both `frontend/` and `backend/`
2. ✅ Signup → Login → JWT persists across refresh
3. ✅ GitHub OAuth connect flow completes
4. ✅ Add a real repo → sync → data appears in MongoDB
5. ✅ Dashboard shows live charts from synced data
6. ✅ AI analysis generates a real Claude response
7. ✅ PDF downloads correctly
8. ✅ All pages are mobile-responsive
9. ✅ `git push` succeeds with clean commit history

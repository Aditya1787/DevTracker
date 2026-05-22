# 🚀 DevTrackr

**DevTrackr** is a premium, high-fidelity AI-powered GitHub Analytics and Developer Productivity Dashboard. It compiles operational telemetry from your team's code repositories to provide dynamic Recharts visualization widgets, identify development bottlenecks, and generate comprehensive generative AI executive summaries, contributor matrices, and strategic recommendations using **Google Gemini 1.5 Pro**.

---

## 🎨 Tech Stack & Tooling

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Standard SPA foundation with blazing fast HMR. |
| **Styling** | Tailwind CSS | Sleek, dark glassmorphic layouts tailored with curated HSL colors. |
| **Visuals** | Recharts, Framer Motion | Smooth, responsive charting canvas and page-load micro-animations. |
| **Backend** | Node.js, Express (ES Modules) | Central REST API server protected by secure routing controls. |
| **Database** | MongoDB, Mongoose | High-performance document storage with bulkWrite telemetry indexing. |
| **AI Engine** | Google Gemini API (`gemini-1.5-pro`) | Generative analysis, bottleneck listings, and executive summaries. |
| **Reporting** | PDFKit | Real-time premium styled multi-page PDF generation and downloads. |

---

## 🏗️ Project Structure

- `/backend` — Node.js + Express API server, MongoDB schema models, Mongoose synchronization jobs, and the Google Gemini API connector.
- `/frontend` — React 18 SPA with standard contexts (Auth, GitHub, Theme, Toast), custom hooks, glass-card layouts, and interactive Recharts components.

---

## ⚙️ Local Development Setup

Follow these step-by-step instructions to get DevTrackr running locally in development mode.

### Prerequisites
Before launching the application, ensure you have the following ready:
* **Node.js** (version 18+ recommended)
* **MongoDB** (Local instance or **MongoDB Atlas** cluster connection URI)
* **Google Gemini API Key** (Obtained from Google AI Studio)
* **GitHub Account** (To create a GitHub OAuth App)

---

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Aditya1787/DevTracker.git
cd DevTracker
```

#### 2. Configure Backend Services
```bash
cd backend
npm install
cp .env.example .env
```
Open the newly created `backend/.env` file and populate it with your environment values:
```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/devtrackr  # Or MongoDB Atlas Connection string
JWT_SECRET=your_jwt_secret_key_here            # Choose a long, secure passphrase
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_google_gemini_api_key_here # Obtained from Google AI Studio

GITHUB_CLIENT_ID=your_github_client_id         # Obtained from GitHub OAuth App
GITHUB_CLIENT_SECRET=your_github_client_secret # Obtained from GitHub OAuth App
GITHUB_CALLBACK_URL=http://localhost:5000/api/github/callback

FRONTEND_URL=http://localhost:5173
```

#### 3. Configure Frontend Client
```bash
cd ../frontend
npm install
cp .env.example .env
```
Open the `frontend/.env` file and verify or populate the following:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GITHUB_CLIENT_ID=your_github_client_id  # Must match the Client ID used in backend
```

#### 4. Run the Dev Servers
You can run both servers concurrently. Open two terminals:

* **In Terminal 1 (Backend)**:
  ```bash
  cd backend
  npm run dev
  ```
  The API server will validate your keys and start listening on `http://localhost:5000`.

* **In Terminal 2 (Frontend)**:
  ```bash
  cd frontend
  npm run dev
  ```
  The Vite developer server will start running on `http://localhost:5173`. Open this URL in your web browser.

---

## 🐙 GitHub OAuth Setup

To authorize users and sync repository metadata, you need to create a **GitHub OAuth App**:

1. Log in to your GitHub account and navigate to **Settings** → **Developer settings** → **OAuth Apps**.
2. Click **New OAuth App**.
3. Fill in the application details:
   - **Application name**: `DevTrackr`
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5000/api/github/callback` *(Crucial for dev environment syncs)*
4. Click **Register application**.
5. Copy the generated **Client ID**.
6. Click **Generate a new client secret** and copy the resulting string.
7. Save these values into your `backend/.env` and `frontend/.env` configurations.

---

## 📡 API Reference Summary

All API endpoints are prefixed with `/api` and require valid JWT Bearer tokens under the `Authorization` header except for the registration paths.

### 🔒 Authentication (`/api/auth`)
* `POST /auth/signup` — Register a new developer account.
* `POST /auth/login` — Sign in and retrieve JWT Bearer token.
* `GET /auth/me` — Load the authenticated user profile.

### 🐙 GitHub Integrations (`/api/github`)
* `GET /github/repos` — Retrieve available public repos from user's GitHub profile.
* `POST /github/repos` — Track a new repository and schedule telemetry sync.
* `POST /github/sync/:repoId` — Trigger a manual, real-time data sync pipeline.

### 📊 Telemetry Analytics (`/api/analytics`)
* `GET /analytics/overview` — Compiles a comprehensive metadata and telemetry overview.
* `GET /analytics/commits` — Fetches daily, weekly, and monthly commit metrics.
* `GET /analytics/pullrequests` — Summarizes PR merge rates, average merge times, and counts.
* `GET /analytics/issues` — Summarizes issue backlogs, label tags, and resolution rates.
* `GET /analytics/contributors` — Returns complete team lists with individual productivity indices.

### 🧠 Gemini AI Insights (`/api/ai`)
* `POST /ai/analyze` — Triggers Gemini 1.5 Pro to compile summaries, bottlenecks, and recommendations.
* `GET /ai/report/:repoId` — Loads the latest generated AI insight snapshot.

### 📄 Premium Reporting (`/api/reports`)
* `GET /reports/pdf/:repoId` — Stream-buffers a high-fidelity PDFKit analysis report for download.

---

## 🚀 Deployment Guide

### Frontend Client (Vercel)
1. Install Vercel CLI or connect your repository on vercel.com.
2. Ensure the build command is configured as `npm run build` with output directory set to `dist`.
3. Set the environment variables:
   - `VITE_API_URL=https://your-backend-domain.com/api`
   - `VITE_GITHUB_CLIENT_ID=your_github_client_id`

### Backend Server (Render)
1. Create a new **Web Service** on render.com.
2. Set the build command to `npm install` and start command to `node src/server.js`.
3. Add all variables defined in `backend/.env` into Render's **Environment** control panel.

### Database (MongoDB Atlas)
1. Provision a free M0 tier cluster on MongoDB Atlas.
2. Whitelist standard network permissions (`0.0.0.0/0` for initial deployments).
3. Connect via the generated URI string and load it into your backend environment configuration.

---

## 🤝 Contributing Guide

1. Fork the repository on GitHub.
2. Create a new topic branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes utilizing descriptive conventional commit messages.
4. Ensure all modifications compile successfully and pass standard syntax validators.
5. Push to your branch and submit a Pull Request for review!

# 🛠️ DevTrackr Complete Platform Setup Guide

Welcome to the **DevTrackr Setup Guide**! This document provides a highly detailed, step-by-step roadmap to configure all third-party integrations (MongoDB Atlas, GitHub Developer Portal, and Google AI Studio) and local configuration files to get the application running without friction.

---

## 📁 Table of Contents
1. [🌐 Platform 1: MongoDB Atlas Database Setup](#-platform-1-mongodb-atlas-database-setup)
2. [🐙 Platform 2: GitHub OAuth App Registration](#-platform-2-github-oauth-app-registration)
3. [🧠 Platform 3: Google Gemini API Key Generation](#-platform-3-google-gemini-api-key-generation)
4. [💻 Local Environment Alignment](#-local-environment-alignment)
5. [🚀 Initial Running & Verification Checks](#-initial-running--verification-checks)

---

## 🌐 Platform 1: MongoDB Atlas Database Setup

DevTrackr utilizes **MongoDB** to store user authentication records, synced repository indexes, commit history, pull requests, issues, and AI reports. Follow these steps to provision a cloud database on MongoDB Atlas:

### Step 1.1: Register or Sign In
1. Go to [MongoDB Atlas Cloud Console](https://www.mongodb.com/cloud/atlas/register).
2. Register for a new account or log in with your existing account (Google Sign-In is supported).

### Step 1.2: Deploy a Free Cluster
1. In the console, click **Create a New Project** (name it `DevTrackr`).
2. Click **Create** under the cluster options.
3. Choose the **M0 (Free)** shared tier.
4. Select your preferred Cloud Provider (e.g., AWS) and a region closest to you (e.g., `us-east-1` or `ap-south-1` for optimal latency).
5. Leave the default name as `Cluster0` and click **Create Deployment**.

### Step 1.3: Configure Database Security & User Access
Before Node.js can connect, you must establish an authorized user:
1. Under **Security** in the left-hand sidebar, navigate to **Database Access**.
2. Click **+ Add New Database User**.
3. Choose **Password** as the authentication method.
4. Set a **Username** (e.g., `devtrackr-admin`).
5. Generate a secure **Password** (save this password somewhere safe, or copy it; avoid special characters like `@` or `:` in the password as they require URL-encoding in the connection URI).
6. Under **Database User Privileges**, select **Read and write to any database**.
7. Click **Add User**.

### Step 1.4: Configure Firewall & Network Access
You must allow your local development environment to establish connection handshakes:
1. Navigate to **Network Access** under **Security** in the sidebar.
2. Click **+ Add IP Address**.
3. To enable access from anywhere (crucial for local testing and cloud deployments), click **Allow Access From Anywhere** (this appends `0.0.0.0/0` to the whitelist).
4. Click **Confirm** and wait for the status to transition from *Pending* to *Active*.

### Step 1.5: Copy the Connection String
1. Go back to the **Database** menu in the sidebar.
2. Click the **Connect** button next to your cluster.
3. Choose **Drivers** (under "Connect to your application").
4. Select **Node.js** as your driver and choose the latest version.
5. Copy the connection string displayed (e.g., `mongodb+srv://devtrackr-admin:<db_password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).
6. Paste this string somewhere temporary. Replace `<db_password>` with the password you created in **Step 1.3**. Keep this connection string ready; it will become your `MONGO_URI`.

---

## 🐙 Platform 2: GitHub OAuth App Registration

To enable users to securely sign in, link their active developer sessions, and synchronize metadata telemetry from their repositories, you must create a GitHub OAuth application:

### Step 2.1: Open Developer Settings
1. Log in to your personal [GitHub Account](https://github.com).
2. Click your profile avatar in the upper right corner and select **Settings**.
3. Scroll down the left sidebar and click **<> Developer Settings** (at the very bottom).
4. Click **OAuth Apps** in the left panel.

### Step 2.2: Register a New Application
1. Click **New OAuth App** in the top right corner.
2. Fill out the application details exactly as shown below:
   * **Application name**: `DevTrackr`
   * **Homepage URL**: `http://localhost:5173` *(The default local Vite server)*
   * **Application description**: `Premium AI-powered engineering telemetry dashboard.`
   * **Authorization callback URL**: `http://localhost:5000/api/github/callback` *(Crucial: This handles the code-exchange redirect to the backend Express server)*
3. Click **Register application**.

### Step 2.3: Generate Client Credentials
1. Under your newly created application summary, note the displayed **Client ID** (e.g., `Ov23ct4Fw...`). Save this value; it is your `GITHUB_CLIENT_ID` / `VITE_GITHUB_CLIENT_ID`.
2. Click **Generate a new client secret**.
3. **IMPORTANT**: Copy the generated **Client Secret** immediately. Once you navigate away, you will never be able to view it again. Save this; it is your `GITHUB_CLIENT_SECRET`.

---

## 🧠 Platform 3: Google Gemini API Key Generation

DevTrackr compiles contributor commit frequencies, pull request rates, and backlog issue telemetry into a detailed context schema. It then feeds this schema to **Gemini 1.5 Pro** to construct dynamic dashboards, identify team performance bottlenecks, and generate executive summaries.

### Step 3.1: Access Google AI Studio
1. Open your web browser and go to [Google AI Studio](https://aistudio.google.com/).
2. Log in with your standard Google account credentials.

### Step 3.2: Generate the API Key
1. Click the prominent **Get API Key** button in the left sidebar.
2. Click **Create API Key**.
3. You can choose **Create API Key in new project** or bind it to an existing Google Cloud Console project.
4. Copy the generated key (usually starts with `AIzaSy...`). Save this key safely; this will be your `GEMINI_API_KEY`.
   > [!NOTE]
   > You can use your active API key: `AIzaSyAD81kIohLP1SLTNL-ShnOBqDUk1heqhDk` which is already saved in your backend configuration.

---

## 💻 Local Environment Alignment

Now that all platform credentials have been created, you must populate your local config files to wire the frontend and backend together.

### 🔌 Part A: Configuring the Backend Server
1. Open the `/backend` folder.
2. Create a new file named `.env` (it will be ignored by git).
3. Copy the structure of `backend/.env.example` and fill in your values:

```env
PORT=5000
NODE_ENV=development

# Paste the MongoDB Atlas Connection URI with your password inserted
MONGO_URI=mongodb+srv://devtrackr-admin:yourPasswordHere@cluster0.xxxx.mongodb.net/devtrackr?retryWrites=true&w=majority

# Choose a long, random secure string for JWT generation
JWT_SECRET=devtrackr_super_secret_session_passphrase_2026
JWT_EXPIRES_IN=7d

# Paste your Gemini API Key
GEMINI_API_KEY=AIzaSyAD81kIohLP1SLTNL-ShnOBqDUk1heqhDk

# Paste your GitHub OAuth credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/github/callback

# Vite Frontend client URL
FRONTEND_URL=http://localhost:5173
```

### 💻 Part B: Configuring the Frontend Client
1. Open the `/frontend` folder.
2. Create a new file named `.env` (it will be ignored by git).
3. Copy the structure of `frontend/.env.example` and fill in the values:

```env
# URL for the Express REST server
VITE_API_URL=http://localhost:5000/api

# Paste your GITHUB_CLIENT_ID (must match the backend value)
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

---

## 🚀 Initial Running & Verification Checks

With environment parameters configured, it is time to launch the application.

### Step 5.1: Run the Backend Server
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm run dev
```
> [!NOTE]
> The backend server validates your environment keys instantly on startup. If any keys (like `GEMINI_API_KEY` or `MONGO_URI`) are missing or incorrectly configured in the `.env` file, the server will log a clear verification message and halt startup.

### Step 5.2: Run the Frontend Client
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
This will start your Vite developer server and display a URL (usually `http://localhost:5173`). Click it or open it in your browser!

### Step 5.3: Execute Verification Flow
Test the entire application pipeline to verify correct integration:
1. **User Sign Up**: Visit `http://localhost:5173/signup` and create a new developer account.
2. **User Login**: Log in with your email and password. You will land on the onboarding page.
3. **Link GitHub Account**: Click **Connect GitHub**. You will be redirected to GitHub to authorize the app. Once authorized, you will return to your dashboard callback.
4. **Add Repositories**: Navigate to the **Repositories** tab. Click **Link New** to view your public repositories, and click **Track Telemetry** on any active project.
5. **Sync Telemetry**: Click the **Sync Stats** button. The server will pull commits, pull requests, issues, and contributors, and write them in bulk to MongoDB.
6. **Dashboard Visualization**: Navigate to the **Dashboard** page. Check that your commit velocity charts, PR pie segments, issue backlog lines, and contributor radar indices render with live telemetry.
7. **Run AI Diagnostics**: Click **Run Diagnostics**. Google Gemini 1.5 Pro will analyze the MongoDB telemetry, compile operational insights, note contributor inactive flags, list work bottlenecks, and present recommendations.
8. **Export PDF Reports**: Navigate to the **Reports** tab and click **Download PDF**. You will instantly download a styled multi-page PDF summary compiled dynamically by PDFKit!

---
> [!TIP]
> If you make future production adjustments (e.g., deploying the backend to Render and the frontend to Vercel), remember to go back to **GitHub Developer Settings** and update the **Homepage URL** and **Authorization callback URL** to match your live production domains!

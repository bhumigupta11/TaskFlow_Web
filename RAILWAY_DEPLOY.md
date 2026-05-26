# Railway Deployment Guide

## Prerequisites
- [Railway account](https://railway.app) (free tier works)
- MongoDB Atlas account (free tier) — [mongodb.com/atlas](https://www.mongodb.com/atlas)
- GitHub account with this repo pushed

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → Create free cluster
2. Create a database user (username + password)
3. Whitelist all IPs: `0.0.0.0/0` (Network Access → Add IP Address)
4. Get connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/team-task-manager`

---

## Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your repository
3. Railway will detect the `backend/` folder — set **Root Directory** to `backend`
4. Add these **Environment Variables**:

```
PORT=5000
MONGO_URI=mongodb+srv://your-user:your-password@cluster.mongodb.net/team-task-manager
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
JWT_EXPIRE=7d
NODE_ENV=production
CORS_ORIGIN=*
```

5. Railway will auto-deploy. Copy the generated URL (e.g., `https://taskflow-backend.railway.app`)

---

## Step 3: Deploy Frontend on Railway

1. In the same Railway project → **New Service** → **GitHub Repo** (same repo)
2. Set **Root Directory** to `frontend`
3. Add these **Environment Variables**:

```
VITE_API_URL=https://your-backend-url.railway.app/api
```

4. Railway will build and deploy. Copy the frontend URL.

---

## Step 4: Update CORS

Go back to your **backend service** → Variables → Update:
```
CORS_ORIGIN=https://your-frontend-url.railway.app
```

Redeploy the backend.

---

## Step 5: Verify

Visit your frontend URL. You should see the TaskFlow login page.

Test the health endpoint: `https://your-backend-url.railway.app/api/health`

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Frontend runs at: http://localhost:5173  
Backend runs at: http://localhost:5000

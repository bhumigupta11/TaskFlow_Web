# Railway.app Configuration

This directory contains a complete full-stack application ready for deployment on Railway.

## Quick Deploy Steps

### 1. Backend Deployment

- **Root Directory**: `/backend`
- **Start Command**: `npm start`
- **Build Command**: `npm install`
- **Port**: 3000

### 2. Frontend Deployment

- **Root Directory**: `/frontend`
- **Build Command**: `npm run build`
- **Start Command**: `npm run preview`
- **Port**: 3000

## Environment Variables

### Backend Service
```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.railway.app
```

### Frontend Service
```
VITE_API_URL=https://your-backend-domain.railway.app/api
```

## Database

MongoDB Atlas is recommended for production:
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Generate connection string
4. Add to Railway environment variables

## Deployment Instructions

1. Push this repository to GitHub
2. Create two Railway projects (one for backend, one for frontend)
3. Connect each to the GitHub repository
4. Set the root directory for each project
5. Add environment variables
6. Deploy

## Health Check

- Backend Health: `GET /api/health`
- Response: `{ "success": true, "message": "Server is running" }`

## Support

For Railway documentation, visit: https://docs.railway.app/

# Quick Start Guide

Get the Team Task Manager up and running in minutes!

## Prerequisites
- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account (for production)

## Local Development Setup

### Option 1: Automatic Setup (Recommended)

1. **Clone or extract the project**
   ```bash
   cd team-task-manager
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup Environment Variables**

   **Backend** (`backend/.env`):
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
   JWT_SECRET=dev_secret_key_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend** (`frontend/.env`):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

**Frontend** (in a new terminal):
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## MongoDB Setup

### Using MongoDB Atlas (Recommended for Production)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Add it to your `.env` file

### Connection String Format:
```
mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
```

## First Login

After starting both servers:

1. Open http://localhost:3000
2. Click "Register here"
3. Create an account
4. Login with your credentials
5. Start creating projects!

## API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests (if available)

### Frontend
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
- Check your connection string
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0)
- Ensure network connectivity

### CORS Errors
- Verify `CORS_ORIGIN` in backend .env
- Check frontend API URL in .env

### Clear Cache
```bash
# Frontend
rm -rf frontend/.cache frontend/node_modules/.vite

# Backend  
rm -rf backend/node_modules
```

## Project Features

✅ User Authentication (Signup/Login)
✅ Project Management
✅ Task Assignment & Tracking
✅ Role-Based Access Control
✅ Dashboard with Statistics
✅ Real-time Task Status Updates
✅ Responsive UI with Material-UI
✅ RESTful API

## Next Steps

1. **Explore the Dashboard** - Create projects and tasks
2. **Add Team Members** - Invite others to your projects
3. **Track Progress** - Monitor tasks on your dashboard
4. **Deploy** - Follow DEPLOYMENT.md for production setup

## Need Help?

- Check README.md for detailed documentation
- Review DEPLOYMENT.md for production deployment
- Check the API endpoints documentation
- Common issues are documented in README.md

## Technology Stack at a Glance

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Material-UI, Vite |
| Backend | Node.js, Express, MongoDB |
| Authentication | JWT |
| State Management | Zustand |
| Database | MongoDB Atlas |
| Deployment | Railway |

Happy task managing! 🚀

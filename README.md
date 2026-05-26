# Team Task Manager - Full Stack Application

A comprehensive web application for managing projects, tasks, and team collaboration with role-based access control.

## 🎯 Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/Member)
- Secure password hashing with bcryptjs

### Projects Management
- Create, read, update, and delete projects
- Add and manage team members
- Project status tracking (Active, On Hold, Completed)
- Priority levels and due dates

### Tasks Management
- Create and assign tasks to team members
- Task status tracking (To Do, In Progress, Review, Completed)
- Priority levels and due dates
- Overdue task tracking
- Estimated vs actual hours tracking

### Dashboard
- Real-time statistics (Total tasks, Completed, In Progress, Overdue)
- Project overview
- Quick project creation
- Task management interface

## 📋 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **date-fns** - Date utilities

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your values**
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your API URL** (if needed)
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   └── tasks.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ProjectDetailPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── projectStore.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users
- `PUT /api/auth/profile` - Update user profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members` - Remove member from project

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/projects/:projectId` - Get project tasks
- `GET /api/tasks/user/tasks` - Get user's tasks
- `GET /api/tasks/dashboard/stats` - Get dashboard statistics
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚢 Deployment Guide

### Deploy to Railway

#### Backend Deployment

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New Project"
   - Select "GitHub Repo"
   - Authorize and select your repository

3. **Deploy Backend**
   - Select the backend folder
   - Railway auto-detects Node.js
   - Add environment variables in Railway dashboard:
     ```
     PORT=3000
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
     JWT_SECRET=your_production_secret
     JWT_EXPIRE=7d
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-domain.railway.app
     ```
   - Deploy

4. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app-name.railway.app`
   - Update this in your frontend environment

#### Frontend Deployment

1. **Deploy Frontend**
   - Create new project in Railway
   - Select your repository
   - Railway auto-detects Vite
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```

2. **Build Configuration**
   - Railway automatically runs `npm run build` for frontend
   - Output directory: `dist`

3. **Get Frontend URL**
   - Railway will provide: `https://your-frontend-domain.railway.app`

#### MongoDB Setup (if not using existing instance)

1. **Create MongoDB Atlas Cluster**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create account and cluster
   - Generate connection string
   - Add IP address to whitelist (0.0.0.0/0 for testing, restrict in production)

## 🧪 Testing

### Test Account
- Email: `test@example.com`
- Password: `password123`

### Manual Testing Steps
1. Register new user
2. Create a project
3. Create tasks within project
4. Assign tasks to team members
5. Update task status and monitor dashboard stats
6. Test role-based access control

## 🐛 Common Issues & Solutions

### CORS Errors
- Ensure `CORS_ORIGIN` in backend .env matches your frontend URL
- Check that the frontend is making requests to the correct API URL

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure network is stable

### JWT Token Errors
- Clear browser localStorage
- Logout and login again
- Check token expiration time in .env

## 📦 Building for Production

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
npm run preview
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Railway Documentation](https://docs.railway.app/)

---

**Happy Task Managing! 🚀**

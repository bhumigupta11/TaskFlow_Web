# Team Task Manager

> A comprehensive full-stack application for managing projects, tasks, and team collaboration with role-based access control, built with React, Node.js, and MongoDB.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Quick Links

- 📖 [Documentation](./README.md)
- 🚀 [Quick Start](./QUICKSTART.md)
- 🏗️ [Architecture](./ARCHITECTURE.md)
- 📡 [API Reference](./API.md)
- 🚢 [Deployment Guide](./DEPLOYMENT.md)
- 🤝 [Contributing](./CONTRIBUTING.md)

## What's Inside

### 🎯 Features
✅ User authentication & authorization
✅ Project management & collaboration
✅ Task creation & assignment
✅ Real-time statistics dashboard
✅ Role-based access control
✅ Responsive Material-UI design
✅ RESTful API architecture
✅ Production-ready deployment

### 💻 Tech Stack
- **Frontend:** React 18, Material-UI, Vite, Zustand
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT with bcryptjs
- **Deployment:** Docker, Railway

## 🚀 Quick Start

```bash
# Clone the project
git clone <repository-url>
cd team-task-manager

# Install and start
npm run install-all
npm run dev
```

Visit `http://localhost:3000` in your browser.

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## 📚 Documentation

- **[README](./README.md)** - Full project documentation
- **[QUICKSTART](./QUICKSTART.md)** - Fast setup guide
- **[ARCHITECTURE](./ARCHITECTURE.md)** - System design & structure
- **[API](./API.md)** - REST API endpoints reference
- **[DEPLOYMENT](./DEPLOYMENT.md)** - Railway deployment guide
- **[CONTRIBUTING](./CONTRIBUTING.md)** - Contribution guidelines

## 🏗️ Project Structure

```
team-task-manager/
├── backend/              # Express API server
│   ├── src/
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth & error handling
│   │   └── server.js    # App entry point
│   └── package.json
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── store/       # Zustand state
│   │   └── App.jsx      # Root component
│   └── package.json
│
└── docker-compose.yml   # Local development setup
```

## 🔧 Available Commands

### Development
```bash
npm run dev              # Start both frontend & backend
npm run install-all     # Install all dependencies
```

### Backend
```bash
cd backend
npm run dev             # Development with hot reload
npm start              # Production
```

### Frontend
```bash
cd frontend
npm run dev            # Development server
npm run build          # Production build
npm run preview        # Preview production build
```

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/register      Create new user
POST   /api/auth/login         User login
GET    /api/auth/me            Get current user
GET    /api/auth/users         Get all users
PUT    /api/auth/profile       Update profile
```

### Projects
```
POST   /api/projects           Create project
GET    /api/projects           Get user projects
GET    /api/projects/:id       Get single project
PUT    /api/projects/:id       Update project
DELETE /api/projects/:id       Delete project
POST   /api/projects/:id/members      Add member
DELETE /api/projects/:id/members      Remove member
```

### Tasks
```
POST   /api/tasks              Create task
GET    /api/tasks/projects/:projectId   Get project tasks
GET    /api/tasks/user/tasks   Get user tasks
GET    /api/tasks/dashboard/stats       Get stats
GET    /api/tasks/:id          Get single task
PUT    /api/tasks/:id          Update task
DELETE /api/tasks/:id          Delete task
```

See [API.md](./API.md) for complete documentation.

## 🚢 Deployment

Deploy to Railway in 3 steps:

1. **Push to GitHub**
2. **Connect to Railway:** Select repository and authorize
3. **Add Environment Variables:** Configure MongoDB URI, JWT secret, etc.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔐 Environment Setup

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📋 Features Checklist

- [x] User authentication (signup/login)
- [x] Project management (CRUD)
- [x] Task management (CRUD)
- [x] User assignment
- [x] Role-based access control
- [x] Dashboard with statistics
- [x] Material-UI design
- [x] Responsive layout
- [ ] Email notifications (future)
- [ ] Real-time updates (future)
- [ ] File attachments (future)
- [ ] Search functionality (future)

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙋 Support

- 📖 Read the [documentation](./README.md)
- 🔍 Check [existing issues](../../issues)
- 💬 Ask in [discussions](../../discussions)
- 📧 Contact via GitHub

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React API Docs](https://react.dev/)
- [Material-UI Components](https://mui.com/)
- [JWT Authentication](https://jwt.io/)

---

**Built with ❤️ for team collaboration**

⭐ If you find this project useful, please give it a star on GitHub!

# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Browser (React)                       │
│                   Material-UI Components                         │
│                      Zustand State                               │
└──────────────────┬──────────────────────────────────────────────┘
                   │ HTTP/REST API
                   │ JWT Token
                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js Server                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes                                                   │   │
│  │ ├── /api/auth       (Authentication)                    │   │
│  │ ├── /api/projects   (Project Management)                │   │
│  │ └── /api/tasks      (Task Management)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Middleware                                               │   │
│  │ ├── Authentication (JWT)                                │   │
│  │ ├── Authorization (Role-based)                          │   │
│  │ └── Error Handling                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Controllers                                              │   │
│  │ ├── Auth Controller                                     │   │
│  │ ├── Project Controller                                  │   │
│  │ └── Task Controller                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Models (Mongoose)                                        │   │
│  │ ├── User                                                │   │
│  │ ├── Project                                             │   │
│  │ └── Task                                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────────┘
                   │ Mongoose Driver
                   ↓
┌─────────────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Cloud Database)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Collections                                              │   │
│  │ ├── users                                               │   │
│  │ ├── projects                                            │   │
│  │ └── tasks                                               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Structure
```
src/
├── App.jsx                    # Main app component with routing
├── main.jsx                   # Entry point
│
├── pages/
│   ├── LoginPage.jsx          # Authentication
│   ├── RegisterPage.jsx       # User registration
│   ├── DashboardPage.jsx      # Main dashboard
│   └── ProjectDetailPage.jsx  # Project details & task management
│
├── components/
│   ├── Navigation.jsx         # Top navigation bar
│   ├── ProjectCard.jsx        # Reusable project card
│   ├── TaskList.jsx           # Task table component
│   └── PrivateRoute.jsx       # Protected route component
│
├── services/
│   └── api.js                 # Axios API client & endpoints
│
├── store/
│   ├── authStore.js           # Auth state (Zustand)
│   └── projectStore.js        # Project/task state (Zustand)
│
└── styles/
    └── globals.css            # Global styles
```

### Backend Structure
```
src/
├── server.js                  # Express app configuration
│
├── config/
│   └── db.js                  # MongoDB connection
│
├── models/
│   ├── User.js                # User schema & methods
│   ├── Project.js             # Project schema
│   └── Task.js                # Task schema
│
├── routes/
│   ├── auth.js                # Auth endpoints
│   ├── projects.js            # Project endpoints
│   └── tasks.js               # Task endpoints
│
├── controllers/
│   ├── authController.js      # Auth logic
│   ├── projectController.js   # Project logic
│   └── taskController.js      # Task logic
│
└── middleware/
    ├── auth.js                # JWT verification & authorization
    └── errorHandler.js        # Error handling
```

## Data Models

### User Schema
```javascript
{
  name: String,           // User's full name
  email: String,          // Email (unique)
  password: String,       // Hashed password
  avatar: String,         // Profile picture URL
  role: String,           // 'Admin' or 'Member'
  isActive: Boolean,      // Account status
  createdAt: Date,        // Registration date
  updatedAt: Date         // Last update
}
```

### Project Schema
```javascript
{
  name: String,           // Project name
  description: String,    // Project description
  owner: ObjectId,        // Reference to User (creator)
  members: [{             // Team members
    userId: ObjectId,     // Reference to User
    role: String,         // 'Admin' or 'Member'
    joinedAt: Date
  }],
  status: String,         // 'Active', 'On Hold', 'Completed'
  priority: String,       // 'Low', 'Medium', 'High'
  dueDate: Date,         // Project deadline
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  title: String,          // Task title
  description: String,    // Task description
  project: ObjectId,      // Reference to Project
  assignedTo: ObjectId,   // Reference to User (assignee)
  createdBy: ObjectId,    // Reference to User (creator)
  status: String,         // 'To Do', 'In Progress', 'Review', 'Completed'
  priority: String,       // 'Low', 'Medium', 'High', 'Urgent'
  dueDate: Date,         // Task deadline
  estimatedHours: Number, // Estimated effort
  actualHours: Number,    // Actual effort
  isOverdue: Boolean,     // Late flag
  attachments: [],        // File references
  comments: [{            // Task comments
    userId: ObjectId,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

```
1. User Registration
   ├─ POST /api/auth/register
   ├─ Validate input & check if email exists
   ├─ Hash password with bcryptjs
   ├─ Create user in database
   ├─ Generate JWT token
   └─ Return token & user data

2. User Login
   ├─ POST /api/auth/login
   ├─ Find user by email
   ├─ Compare passwords using bcryptjs
   ├─ Generate JWT token
   └─ Return token & user data

3. Protected Routes
   ├─ Client sends token in Authorization header
   ├─ Middleware verifies JWT signature
   ├─ Extract user ID & role from token
   ├─ Proceed to route handler or reject request
   └─ Response includes protected resource
```

## Authorization Rules

### Role-Based Access (RBAC)

**Admin Role:**
- Create/update/delete projects
- Add/remove project members
- Create/update/delete tasks
- Access all projects and tasks

**Member Role:**
- View assigned projects
- Create/update/delete own tasks
- View project tasks
- Cannot modify project settings

## State Management

### Frontend State (Zustand)

**Auth Store:**
- `user` - Current user object
- `token` - JWT token
- `login(email, password)` - Login user
- `register(name, email, password)` - Register user
- `logout()` - Clear auth state
- `getMe()` - Fetch current user

**Project Store:**
- `projects` - Array of projects
- `tasks` - Array of tasks
- `stats` - Dashboard statistics
- CRUD operations for projects and tasks

## Request/Response Flow

### Example: Create Task
```
Client (Frontend)
    ↓
    │ POST /api/tasks
    │ Body: { title, description, projectId, ... }
    │ Headers: { Authorization: "Bearer JWT_TOKEN" }
    ↓
Express Server
    ↓
    │ Route Handler (/tasks)
    │ ├─ Auth Middleware (verify JWT)
    │ ├─ Pass to Controller
    │ ↓
    │ Task Controller (createTask)
    │ ├─ Validate input
    │ ├─ Check project access
    │ ├─ Create task document
    │ ├─ Populate references
    │ └─ Return response
    ↓
MongoDB
    ├─ Insert task document
    └─ Return document data
    ↓
Server
    ├─ Format response
    └─ Send JSON response
    ↓
Client (Frontend)
    ├─ Receive response
    ├─ Update Zustand store
    ├─ Update UI components
    └─ Display success message
```

## Error Handling

### Error Flow
```
Request
  ↓
  Validation Error?
  ├─ YES → 400 Bad Request
  ├─ Missing token?
  ├─ YES → 401 Unauthorized
  ├─ Invalid token?
  ├─ YES → 401 Unauthorized
  ├─ Insufficient permissions?
  ├─ YES → 403 Forbidden
  ├─ Resource not found?
  ├─ YES → 404 Not Found
  ├─ Other errors?
  ├─ YES → 500 Internal Server Error
  ↓
Response with error message
```

## Deployment Architecture

```
GitHub Repository
  ↓
  ├─ Push to main branch
  ↓
Railway CI/CD
  ├─ Trigger workflows
  ├─ Build backend service
  ├─ Build frontend service
  ├─ Run tests
  ↓
Docker Containers
  ├─ Backend Container (Node.js)
  ├─ Frontend Container (Nginx/Serve)
  ├─ MongoDB Container (local dev only)
  ↓
Railway Services
  ├─ Backend: https://backend-url.railway.app
  ├─ Frontend: https://frontend-url.railway.app
  ├─ Database: MongoDB Atlas (external)
```

## Performance Considerations

1. **Database Indexing**
   - Index on user email (unique)
   - Index on project owner
   - Index on task project reference
   - Index on task assignedTo

2. **API Optimization**
   - Pagination for large datasets
   - Lean queries to select only needed fields
   - Population optimization

3. **Frontend Optimization**
   - Lazy loading components
   - Code splitting with Vite
   - Zustand for efficient state updates

4. **Caching**
   - Browser caching for static assets
   - Local storage for JWT token
   - Zustand state caching

## Security Considerations

1. **Authentication**
   - JWT tokens with expiration
   - Secure password hashing (bcryptjs)

2. **Authorization**
   - Role-based access control
   - Resource-level permissions

3. **Data Validation**
   - Input validation on both client & server
   - Type checking with Mongoose

4. **API Security**
   - CORS configuration
   - Error message sanitization
   - SQL/NoSQL injection prevention (via Mongoose)

## Scalability Roadmap

1. **Short Term**
   - Add request logging
   - Implement rate limiting
   - Add caching layer (Redis)

2. **Medium Term**
   - Microservices architecture
   - Event-driven design
   - Message queue (Bull/RabbitMQ)

3. **Long Term**
   - GraphQL API
   - Real-time updates (WebSocket)
   - Advanced analytics

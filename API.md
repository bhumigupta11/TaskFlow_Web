# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require Bearer token authentication:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Users
```http
GET /auth/users
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Member"
    }
  ]
}
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## Project Endpoints

### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign company website",
  "priority": "High",
  "dueDate": "2024-12-31"
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Website Redesign",
    "description": "Redesign company website",
    "owner": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "userId": {"_id": "507f1f77bcf86cd799439011", "name": "John Doe"},
        "role": "Admin",
        "joinedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "status": "Active",
    "priority": "High",
    "dueDate": "2024-12-31"
  }
}
```

### Get User Projects
```http
GET /projects
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Website Redesign",
      "description": "Redesign company website",
      "status": "Active",
      "priority": "High"
    }
  ]
}
```

### Get Single Project
```http
GET /projects/:id
Authorization: Bearer <token>
```

### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "On Hold",
  "priority": "Medium"
}
```

### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Add Project Member
```http
POST /projects/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439013",
  "role": "Member"
}
```

### Remove Project Member
```http
DELETE /projects/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439013"
}
```

---

## Task Endpoints

### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design Homepage",
  "description": "Create mockups and prototypes",
  "projectId": "507f1f77bcf86cd799439012",
  "priority": "High",
  "dueDate": "2024-02-15",
  "estimatedHours": 8
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "Design Homepage",
    "description": "Create mockups and prototypes",
    "project": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Website Redesign"
    },
    "status": "To Do",
    "priority": "High",
    "dueDate": "2024-02-15",
    "estimatedHours": 8,
    "isOverdue": false,
    "createdBy": {"_id": "507f1f77bcf86cd799439011", "name": "John Doe"}
  }
}
```

### Get Project Tasks
```http
GET /tasks/projects/:projectId?status=In%20Progress&priority=High
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (To Do, In Progress, Review, Completed)
- `priority` - Filter by priority (Low, Medium, High, Urgent)
- `assignedTo` - Filter by assigned user ID

### Get User Tasks
```http
GET /tasks/user/tasks
Authorization: Bearer <token>
```

### Get Dashboard Stats
```http
GET /tasks/dashboard/stats
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "totalTasks": 25,
    "completedTasks": 5,
    "inProgressTasks": 10,
    "overdueTasks": 2,
    "totalProjects": 3,
    "activeProjects": 2,
    "completedProjects": 1
  }
}
```

### Get Single Task
```http
GET /tasks/:id
Authorization: Bearer <token>
```

### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "In Progress",
  "priority": "Medium",
  "assignedTo": "507f1f77bcf86cd799439013",
  "actualHours": 4
}
```

### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting

- 100 requests per 15 minutes per IP (recommended)
- Implement in production for API security

## Pagination (Optional Enhancement)

You can add pagination query parameters:
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

Example:
```http
GET /tasks/user/tasks?page=1&limit=20
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "priority": "High"
  }'
```

---

## Health Check

```http
GET /api/health
```

**Response (200)**
```json
{
  "success": true,
  "message": "Server is running"
}
```

This endpoint requires no authentication.

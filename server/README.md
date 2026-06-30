# Portfolio Backend — Production-Ready API & Admin Dashboard

## Overview

A robust, secure, and production-grade backend for your portfolio website. Built with **Express.js** and **SQLite**, featuring:

- Clean RESTful API for frontend data consumption
- Admin authentication with session-based security
- Full CRUD operations for projects, events, and certifications
- Input validation with Zod
- Rate limiting on login attempts (brute-force protection)
- XSS prevention through input sanitization
- SQL injection prevention via parameterized queries
- CORS configured for frontend integration
- Security headers with Helmet

---

## Quick Start

### 1. Installation

```bash
cd server
npm install
```

### 2. Database Setup

Initialize the database schema:

```bash
npm run migrate
```

### 3. Create Admin User

Create your first admin account (interactive prompt):

```bash
npm run init-admin
```

**Prompts:**

```
Enter admin username: admin
Enter admin password (min 8 characters): ••••••••
Confirm password: ••••••••
Enter admin email (optional): your@email.com
```

### 4. Seed Sample Data (Optional)

Populate the database with sample projects, events, and certifications:

```bash
npm run seed
```

### 5. Start the Server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm run build
npm run start
```

Server will start on `http://localhost:5000`

---

## API Documentation

### Public API (No Auth Required)

All endpoints return JSON with `success` boolean and `data` field.

#### Projects

| Method | Endpoint | Description |
| ------ | -------------------------------------------- | ------------------------------ |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects?page=1&limit=10&search=query` | Paginated projects with search |
| GET | `/api/projects/:id` | Get project by ID |
| GET | `/api/projects/slug/:slug` | Get project by slug |

**Response Format:**

```json
{
 "success": true,
 "data": [
 {
 "id": 1,
 "title": "Music Recommendation Engine",
 "slug": "music-recommendation-engine",
 "short_desc": "...",
 "core_problem": "...",
 "technical_solution": "...",
 "tech_stack": ["Python", "ONNX"],
 "github_link": "https://...",
 "live_demo_link": "https://...",
 "status": "completed",
 "created_at": "2024-01-01T00:00:00Z",
 "updated_at": "2024-01-01T00:00:00Z"
 }
 ]
}
```

#### Events

| Method | Endpoint | Description |
| ------ | ----------------------------- | ---------------- |
| GET | `/api/events` | Get all events |
| GET | `/api/events?page=1&limit=10` | Paginated events |
| GET | `/api/events/:id` | Get event by ID |

**Response Format:**

```json
{
 "success": true,
 "data": [
 {
 "id": 1,
 "title": "IndabaX Benin 2025",
 "organization": "African AI Research",
 "year": "2025",
 "role": "participant",
 "description": "...",
 "created_at": "2024-01-01T00:00:00Z"
 }
 ]
}
```

#### Certifications

| Method | Endpoint | Description |
| ------ | ------------------------------------- | ------------------------ |
| GET | `/api/certifications` | Get all certifications |
| GET | `/api/certifications?page=1&limit=10` | Paginated certifications |
| GET | `/api/certifications/:id` | Get certification by ID |

**Response Format:**

```json
{
 "success": true,
 "data": [
 {
 "id": 1,
 "platform": "DataCamp",
 "title": "Associate Data Scientist in Python",
 "status": "in-progress",
 "credential_url": "https://...",
 "date_earned": "2024-01-01",
 "created_at": "2024-01-01T00:00:00Z"
 }
 ]
}
```

### Admin API (Requires Authentication)

#### Authentication

**Login:**

```bash
POST /admin/login
Content-Type: application/json

{
 "username": "admin",
 "password": "your-password"
}
```

**Response:**

```json
{
 "success": true,
 "message": "Login successful",
 "user": {
 "id": 1,
 "username": "admin",
 "email": "admin@example.com"
 }
}
```

**Logout:**

```bash
POST /admin/logout
```

**Get Current Session:**

```bash
GET /admin/session
```

#### Projects CRUD

**Create:**

```bash
POST /admin/projects
Content-Type: application/json

{
 "title": "New Project",
 "slug": "new-project",
 "short_desc": "Short description...",
 "core_problem": "Problem statement...",
 "technical_solution": "How we solved it...",
 "tech_stack": ["React", "Node.js"],
 "github_link": "https://github.com/...",
 "live_demo_link": "https://demo.com",
 "status": "completed"
}
```

**Update:**

```bash
PUT /admin/projects/:id
Content-Type: application/json

{
 "title": "Updated title",
 "status": "in_progress"
}
```

**Delete:**

```bash
DELETE /admin/projects/:id
```

#### Events CRUD

**Create:**

```bash
POST /admin/events
Content-Type: application/json

{
 "title": "Event Name",
 "organization": "Organization",
 "year": "2025",
 "role": "participant",
 "description": "Description..."
}
```

**Update & Delete similar to Projects**

#### Certifications CRUD

**Create:**

```bash
POST /admin/certifications
Content-Type: application/json

{
 "platform": "Coursera",
 "title": "Certificate Name",
 "status": "completed",
 "credential_url": "https://...",
 "date_earned": "2024-01-01"
}
```

**Update & Delete similar to Projects**

---

## Security Features

### 1. Authentication

- Session-based authentication
- Bcryptjs password hashing (10 rounds)
- Secure session cookies (httpOnly, sameSite, secure in production)

### 2. Input Validation

- Zod schemas for all request bodies
- Enum validation for status and role fields
- URL validation for links
- Length constraints on text fields

### 3. Rate Limiting

- **Login endpoint:** 5 attempts per 15 minutes
- Prevents brute-force attacks

### 4. XSS Prevention

- Input sanitization middleware
- Removes `<>` characters from string inputs
- Trim whitespace

### 5. SQL Injection Prevention

- Parameterized queries via better-sqlite3
- No string concatenation for queries

### 6. CORS Security

- Whitelist origin: `http://localhost:5173` (development)
- Credentials required
- Restricted methods: GET, POST, PUT, DELETE

### 7. Security Headers

- Helmet.js for comprehensive headers
- CSP, X-Frame-Options, X-Content-Type-Options, etc.

---

## Project Structure

```
server/
├── src/
│ ├── config/
│ │ └── database.ts # SQLite setup & schema
│ ├── models/
│ │ ├── ProjectModel.ts # Project CRUD
│ │ ├── EventModel.ts # Event CRUD
│ │ ├── CertificationModel.ts # Certification CRUD
│ │ └── AdminUserModel.ts # User authentication
│ ├── routes/
│ │ ├── api.ts # Public API endpoints
│ │ ├── admin-auth.ts # Login/logout/session
│ │ └── admin-crud.ts # Admin CRUD operations
│ ├── middleware/
│ │ └── index.ts # Validation, auth, error handling
│ ├── schemas/
│ │ └── validation.ts # Zod validation schemas
│ ├── types/
│ │ └── index.ts # TypeScript interfaces
│ ├── scripts/
│ │ ├── migrate.ts # Database migrations
│ │ ├── seed.ts # Sample data
│ │ └── init-admin.ts # Admin creation
│ └── index.ts # Server entry point
├── data/
│ └── portfolio.db # SQLite database (auto-created)
├── .env # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## ️ Environment Variables

Create a `.env` file in the server directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_PATH=./data/portfolio.db

# Security
SESSION_SECRET=your-super-secret-key-change-in-production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

---

## ️ Database Schema

### Projects Table

```sql
CREATE TABLE projects (
 id INTEGER PRIMARY KEY,
 title TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 short_desc TEXT NOT NULL,
 core_problem TEXT NOT NULL,
 technical_solution TEXT NOT NULL,
 tech_stack TEXT NOT NULL, -- JSON array
 github_link TEXT,
 live_demo_link TEXT,
 status TEXT CHECK(status IN ('in_progress', 'completed')),
 created_at DATETIME,
 updated_at DATETIME
)
```

### Events Table

```sql
CREATE TABLE events (
 id INTEGER PRIMARY KEY,
 title TEXT NOT NULL,
 organization TEXT NOT NULL,
 year TEXT NOT NULL,
 role TEXT CHECK(role IN ('participant', 'mentor', 'speaker')),
 description TEXT NOT NULL,
 created_at DATETIME,
 updated_at DATETIME
)
```

### Certifications Table

```sql
CREATE TABLE certifications (
 id INTEGER PRIMARY KEY,
 platform TEXT NOT NULL,
 title TEXT NOT NULL,
 status TEXT CHECK(status IN ('in_progress', 'completed')),
 credential_url TEXT,
 date_earned DATE,
 created_at DATETIME,
 updated_at DATETIME
)
```

### Admin Users Table

```sql
CREATE TABLE admin_users (
 id INTEGER PRIMARY KEY,
 username TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 email TEXT UNIQUE,
 last_login DATETIME,
 created_at DATETIME,
 updated_at DATETIME
)
```

---

## Testing the API

### Using cURL

**Get all projects:**

```bash
curl http://localhost:5000/api/projects
```

**Login:**

```bash
curl -X POST http://localhost:5000/admin/login \
 -H "Content-Type: application/json" \
 -d '{"username":"admin","password":"password"}'
```

**Create project (after login):**

```bash
curl -X POST http://localhost:5000/admin/projects \
 -H "Content-Type: application/json" \
 -d '{
 "title": "New Project",
 "slug": "new-project",
 "short_desc": "...",
 "core_problem": "...",
 "technical_solution": "...",
 "tech_stack": ["Tech1", "Tech2"],
 "status": "completed"
 }'
```

---

## Frontend Integration

Update your React components to fetch data from the backend:

```typescript
// In your section components
useEffect(() => {
 fetch("http://localhost:5000/api/projects")
 .then((res) => res.json())
 .then((data) => setProjects(data.data))
 .catch((error) => console.error(error));
}, []);
```

---

## Validation Rules

### Projects

- **title:** 3-255 characters
- **slug:** lowercase, numbers, hyphens only
- **short_desc:** 10-500 characters
- **core_problem:** 20-2000 characters
- **technical_solution:** 20-2000 characters
- **tech_stack:** at least 1 technology
- **github_link, live_demo_link:** valid URLs (optional)
- **status:** `in_progress` or `completed`

### Events

- **title, organization:** 3-255 characters
- **year:** 4 digits or range (e.g., "2024" or "2024 – Present")
- **role:** `participant`, `mentor`, or `speaker`
- **description:** 10-1000 characters

### Certifications

- **platform, title:** required
- **status:** `in_progress` or `completed`
- **credential_url:** valid URL (optional)
- **date_earned:** ISO date format (optional)

---

## ️ Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Run migrations
npm run migrate

# Seed sample data
npm run seed

# Create admin user
npm run init-admin

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## Production Checklist

- [ ] Change `SESSION_SECRET` in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Set `CORS_ORIGIN` to your production domain
- [ ] Use HTTPS in production
- [ ] Update database path to persistent location
- [ ] Set up proper logging/monitoring
- [ ] Enable HTTPS for session cookies (automatically on production)
- [ ] Configure rate limiting based on traffic
- [ ] Use environment-specific environment variables

---

## Support

For issues or questions, refer to the inline comments in the code or review the validation schemas in `src/schemas/validation.ts`.

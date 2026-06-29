# Portfolio Backend Setup — Complete Guide

## 🎯 What You've Got

A **production-ready backend** for your React portfolio featuring:

✅ **REST API** for Projects, Events & Certifications  
✅ **Admin Dashboard API** with full CRUD  
✅ **Session-based Authentication** (secure, bcrypt hashed)  
✅ **SQLite Database** (lightweight, file-based)  
✅ **Input Validation** (Zod schemas)  
✅ **Security** (Rate limiting, XSS prevention, CORS, Helmet headers)  
✅ **Error Handling** (Comprehensive error responses)

---

## 🚀 Quick Start (5 Minutes)

### 1. Navigate to Backend Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

This installs Express, SQLite, validation, authentication, and all necessary packages.

### 3. Initialize Database

```bash
npm run migrate
```

Creates SQLite database with schema for:

- `projects` table (title, slug, problem, solution, tech stack, links, status)
- `events` table (title, org, year, role, description)
- `certifications` table (platform, title, status, credential URL)
- `admin_users` table (for authentication)

### 4. Create Admin Account

```bash
npm run init-admin
```

**Interactive prompt:**

```
Enter admin username: admin
Enter admin password (min 8 characters): your-secure-password
Confirm password: your-secure-password
Enter admin email (optional): your@email.com
```

✓ Admin account created!

### 5. Seed Sample Data (Optional)

```bash
npm run seed
```

Populates database with your existing project/event/certification data.

### 6. Start Development Server

```bash
npm run dev
```

**Output:**

```
╔════════════════════════════════════════╗
║   Portfolio Backend Server Running    ║
╠════════════════════════════════════════╣
║  Environment: development              ║
║  Port: 5000                            ║
║  API: http://localhost:5000            ║
╚════════════════════════════════════════╝
```

✅ **Server is running!**

---

## 📡 Testing the API

### Public Endpoints (No Auth)

**Get All Projects:**

```bash
curl http://localhost:5000/api/projects
```

**Get All Events:**

```bash
curl http://localhost:5000/api/events
```

**Get All Certifications:**

```bash
curl http://localhost:5000/api/certifications
```

### Admin Endpoints (Requires Login)

**Login:**

```bash
curl -X POST http://localhost:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "your@email.com"
  }
}
```

---

## 📋 API Routes Overview

| Route                   | Method          | Auth | Description            |
| ----------------------- | --------------- | ---- | ---------------------- |
| `/api/projects`         | GET             | ❌   | Get all projects       |
| `/api/events`           | GET             | ❌   | Get all events         |
| `/api/certifications`   | GET             | ❌   | Get all certifications |
| `/admin/login`          | POST            | ❌   | Admin login            |
| `/admin/logout`         | POST            | ✅   | Admin logout           |
| `/admin/projects`       | POST            | ✅   | Create project         |
| `/admin/projects/:id`   | PUT             | ✅   | Update project         |
| `/admin/projects/:id`   | DELETE          | ✅   | Delete project         |
| `/admin/events`         | POST/PUT/DELETE | ✅   | Event CRUD             |
| `/admin/certifications` | POST/PUT/DELETE | ✅   | Certification CRUD     |

---

## 🔗 Frontend Integration

### Step 1: Frontend API Service

Create `app/src/services/api.ts` (template in `INTEGRATION_GUIDE.md`):

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getProjects() {
  const response = await fetch(`${API_URL}/api/projects`);
  return response.json();
}

export async function getEvents() {
  const response = await fetch(`${API_URL}/api/events`);
  return response.json();
}

// ... more methods
```

### Step 2: Update Components

Replace hardcoded `const PROJECTS = [...]` with:

```typescript
import { useEffect, useState } from 'react';
import { getProjects } from '@/services/api';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <section>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}
```

### Step 3: Update Frontend Environment

Create `app/.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Run Both Servers

**Terminal 1 - Backend:**

```bash
cd server && npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd app && npm run dev
```

Both running on different ports = **Zero conflicts!**

---

## 🔒 Security Features Explained

### 1. **Brute-Force Protection**

- Login limited to **5 attempts per 15 minutes**
- Prevents dictionary attacks
- Automatic cooldown

### 2. **Password Security**

- Bcrypt hashing with **10 rounds**
- Can't be reversed
- Resistant to modern attacks

### 3. **Input Validation**

- **Zod schemas** for every endpoint
- Invalid data rejected before processing
- Type-safe responses

### 4. **SQL Injection Prevention**

- **Parameterized queries** via better-sqlite3
- No string concatenation
- Database is protected from malicious input

### 5. **XSS Prevention**

- HTML characters sanitized
- `<>` removed from all inputs
- Frontend and backend validation

### 6. **CORS Security**

- Only your domain allowed
- Prevents cross-site requests
- Credentials require explicit origin match

### 7. **Session Security**

- HttpOnly cookies (JavaScript can't access)
- SameSite=Strict (prevents CSRF)
- Secure flag on production (HTTPS only)

---

## 📁 File Structure

```
Portfolio/
├── server/                          ← New backend!
│   ├── src/
│   │   ├── config/database.ts       ← SQLite setup
│   │   ├── models/                  ← Database operations
│   │   ├── routes/                  ← API endpoints
│   │   ├── middleware/              ← Auth, validation
│   │   ├── schemas/                 ← Zod validation
│   │   ├── types/                   ← TypeScript interfaces
│   │   ├── scripts/                 ← Database scripts
│   │   └── index.ts                 ← Server entry
│   ├── data/
│   │   └── portfolio.db             ← SQLite database
│   ├── .env                         ← Configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── app/                             ← Your React app
│   ├── src/
│   │   ├── services/api.ts          ← NEW: API client
│   │   ├── sections/                ← Modified: fetch from API
│   │   └── ...
│   └── .env.local
│
├── INTEGRATION_GUIDE.md             ← Detailed guide
└── BACKEND_SETUP_GUIDE.md           ← This file!
```

---

## ⚙️ Configuration

### `.env` File (Backend)

Already pre-configured, but you can customize:

```env
PORT=5000
NODE_ENV=development

# Database location
DATABASE_PATH=./data/portfolio.db

# Sessions (change in production!)
SESSION_SECRET=your-secret-key

# Rate limiting
RATE_LIMIT_MAX_REQUESTS=5

# CORS (frontend URL)
CORS_ORIGIN=http://localhost:5173
```

For **production**, use strong random values:

```bash
# Generate secure string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Example CRUD Operations

### Create a Project

```bash
curl -X POST http://localhost:5000/admin/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Chat Bot",
    "slug": "ai-chat-bot",
    "short_desc": "An AI-powered chatbot",
    "core_problem": "Users need quick answers",
    "technical_solution": "Built with LLMs and RAG",
    "tech_stack": ["Python", "OpenAI", "FastAPI"],
    "github_link": "https://github.com/...",
    "live_demo_link": "https://demo.com",
    "status": "completed"
  }'
```

### Update a Project

```bash
curl -X PUT http://localhost:5000/admin/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Chat Bot v2",
    "status": "in_progress"
  }'
```

### Delete a Project

```bash
curl -X DELETE http://localhost:5000/admin/projects/1
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

```
Error: listen EADDRINUSE :::5000
```

**Solution:** Change PORT in `.env` or kill process on port 5000:

```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Issue: Database Not Found

```
Error: SQLITE_CANTOPEN
```

**Solution:** Ensure `data/` directory exists:

```bash
npm run migrate
```

### Issue: CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Check `CORS_ORIGIN` in `.env` matches frontend URL:

```env
CORS_ORIGIN=http://localhost:5173
```

### Issue: Can't Login

```
Invalid credentials
```

**Solution:** Verify admin was created:

```bash
npm run init-admin
```

---

## 📊 Database Inspection

### View Database Contents (SQLite CLI)

```bash
# Install sqlite3
npm install -g sqlite3

# Connect to database
sqlite3 data/portfolio.db

# Query examples
sqlite> SELECT * FROM projects;
sqlite> SELECT * FROM events;
sqlite> SELECT * FROM admin_users;
sqlite> .quit
```

---

## 🚀 Deployment

### Backend Deployment Steps

1. **Build production:**

   ```bash
   npm run build
   ```

2. **Set production env:**

   ```env
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   SESSION_SECRET=[very-strong-random-key]
   ```

3. **Deploy to:**
   - **Heroku**: `git push heroku main`
   - **Railway**: `railway up`
   - **Fly.io**: `fly deploy`
   - **Your server**: `npm run start`

4. **Initialize on production:**
   ```bash
   npm run migrate
   npm run init-admin
   ```

### Frontend Update

Update `app/.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## 📚 Documentation Files

| File                     | Purpose                    |
| ------------------------ | -------------------------- |
| `server/README.md`       | Complete API documentation |
| `INTEGRATION_GUIDE.md`   | Frontend integration steps |
| `BACKEND_SETUP_GUIDE.md` | This file - setup guide    |

---

## ✨ Key Features Summary

| Feature            | Implementation                      |
| ------------------ | ----------------------------------- |
| **Database**       | SQLite + better-sqlite3             |
| **Authentication** | Session + Bcrypt                    |
| **Validation**     | Zod schemas                         |
| **Security**       | Rate limiting, XSS prevention, CORS |
| **Error Handling** | Comprehensive error responses       |
| **Type Safety**    | Full TypeScript support             |
| **Performance**    | Compression, connection pooling     |
| **Development**    | Hot reload with nodemon             |

---

## 🎓 Learning Resources

- **Express.js**: https://expressjs.com
- **SQLite**: https://www.sqlite.org
- **Zod**: https://zod.dev
- **Bcryptjs**: https://github.com/dcodeIO/bcrypt.js
- **Better-sqlite3**: https://github.com/WiseLibs/better-sqlite3

---

## 💡 Next Steps

1. ✅ Backend running locally
2. ✅ Database initialized
3. ✅ Admin account created
4. ✅ Sample data seeded
5. **TODO**: Integrate frontend (see `INTEGRATION_GUIDE.md`)
6. **TODO**: Build admin dashboard UI
7. **TODO**: Deploy both services
8. **TODO**: Set up automated backups

---

## 📞 Support & Debugging

**Check server logs:**

```bash
# Development (verbose)
npm run dev

# Production
NODE_ENV=production npm run start
```

**Verify API is working:**

```bash
curl http://localhost:5000/health
```

**Test database connection:**

```bash
npm run migrate
```

---

## ✅ Checklist

- [ ] Dependencies installed: `npm install`
- [ ] Database initialized: `npm run migrate`
- [ ] Admin user created: `npm run init-admin`
- [ ] Sample data seeded: `npm run seed`
- [ ] Server running: `npm run dev`
- [ ] API responding: `curl http://localhost:5000/api/projects`
- [ ] Frontend .env.local created with API URL
- [ ] Frontend components updated to use API
- [ ] Both servers running without errors

---

**You're all set! 🎉 Your backend is production-ready and your portfolio is now data-driven.**

For detailed API documentation, see `server/README.md`  
For frontend integration steps, see `INTEGRATION_GUIDE.md`

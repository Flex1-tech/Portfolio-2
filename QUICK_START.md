# Quick Start Commands Reference

## One-Time Setup (First Time Only)

### 1. Backend Installation & Configuration

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Initialize database (creates schema)
npm run migrate

# Create admin account (interactive)
npm run init-admin
# Enter: username, password, email

# [OPTIONAL] Seed with sample data
npm run seed
```

### 2. Frontend Configuration

```bash
# Navigate to app directory
cd app

# Create environment file
echo 'VITE_API_URL=http://localhost:5000' > .env.local

# Install dependencies (if not already done)
npm install
```

---

## Daily Development (Every Session)

### Start Backend Server

```bash
cd server
npm run dev
# Output: Server running on http://localhost:5000
```

### Start Frontend Server (New Terminal)

```bash
cd app
npm run dev
# Output: Local: http://localhost:5173
```

**Both must be running for full functionality!**

---

## Common Commands

### Backend Commands

```bash
cd server

# Development with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint

# Database operations
npm run migrate          # Initialize schema
npm run seed            # Add sample data
npm run init-admin      # Create admin user
```

### Frontend Commands

```bash
cd app

# Development with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## API Endpoints Quick Reference

### Public API (No Auth)

```bash
# Get all projects
curl http://localhost:5000/api/projects

# Get project by ID
curl http://localhost:5000/api/projects/1

# Get all events
curl http://localhost:5000/api/events

# Get all certifications
curl http://localhost:5000/api/certifications

# Health check
curl http://localhost:5000/health
```

### Admin API (Requires Auth)

```bash
# Login
curl -X POST http://localhost:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Create project
curl -X POST http://localhost:5000/admin/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "slug": "new-project",
    "short_desc": "Description",
    "core_problem": "Problem",
    "technical_solution": "Solution",
    "tech_stack": ["Tech1", "Tech2"],
    "status": "completed"
  }'

# Update project
curl -X PUT http://localhost:5000/admin/projects/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# Delete project
curl -X DELETE http://localhost:5000/admin/projects/1

# Logout
curl -X POST http://localhost:5000/admin/logout
```

---

## Troubleshooting Commands

### Port Already in Use

```bash
# macOS/Linux - Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Database Issues

```bash
# Reset database (deletes data!)
rm server/data/portfolio.db
npm run migrate
npm run seed

# Check database
sqlite3 server/data/portfolio.db
> SELECT * FROM projects;
> .quit
```

### Clear Node Modules & Reinstall

```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd app
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
npm run type-check
npm run build
```

---

## Environment Setup

### Backend `.env` File

```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./data/portfolio.db
SESSION_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env.local` File

```env
VITE_API_URL=http://localhost:5000
```

---

## Database Operations

### View Database Content

```bash
# Install sqlite3 if needed
npm install -g sqlite3

# Connect to database
sqlite3 server/data/portfolio.db

# Useful queries
.tables                          # Show all tables
SELECT * FROM projects;         # All projects
SELECT * FROM events;           # All events
SELECT * FROM admin_users;      # All users
.schema projects                # Table structure
.quit                           # Exit
```

### Backup Database

```bash
cp server/data/portfolio.db server/data/portfolio.db.backup
```

### Restore Database

```bash
cp server/data/portfolio.db.backup server/data/portfolio.db
```

---

## Production Deployment

### Build for Production

```bash
# Backend
cd server
npm run build
NODE_ENV=production npm run start

# Frontend
cd app
npm run build
# Deploy dist/ folder to hosting
```

### Set Production Environment Variables

**Backend `.env`:**

```env
NODE_ENV=production
PORT=5000
DATABASE_PATH=/var/data/portfolio.db
SESSION_SECRET=[generate-strong-key]
CORS_ORIGIN=https://yourdomain.com
```

**Frontend environment:**

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## Testing Workflow

### 1. Start Fresh

```bash
cd server
npm run migrate
npm run seed
npm run dev
```

### 2. Test API Endpoints

```bash
# In another terminal
curl http://localhost:5000/api/projects
```

### 3. Start Frontend

```bash
cd app
npm run dev
```

### 4. Check Browser

- Open http://localhost:5173
- Open DevTools → Network & Console
- Verify data loads from API

---

## Performance Monitoring

### Check Backend Logs

```bash
# Already shown in terminal where npm run dev runs
# Look for timing information and errors
```

### Check Database Size

```bash
ls -lh server/data/portfolio.db
# Shows file size
```

### Check Memory Usage

```bash
# macOS/Linux
ps aux | grep node

# Windows
tasklist | findstr node
```

---

## Common Issues & Solutions

| Issue                   | Solution                              |
| ----------------------- | ------------------------------------- |
| **CORS Error**          | Check `CORS_ORIGIN` in `.env`         |
| **Can't connect to DB** | Run `npm run migrate`                 |
| **Admin login fails**   | Run `npm run init-admin`              |
| **Data not showing**    | Check browser DevTools Network tab    |
| **Port 5000 in use**    | Kill process or change PORT in `.env` |
| **TypeScript errors**   | Run `npm run type-check`              |

---

## Development Tips

### Use Different Ports

```bash
# Backend on 5001 (if 5000 is busy)
PORT=5001 npm run dev

# Update frontend .env.local
VITE_API_URL=http://localhost:5001
```

### Enable Debug Logging

```bash
# Backend with debug output
DEBUG=* npm run dev

# Frontend with verbose output
npm run dev -- --host
```

### Hot Reload

```bash
# Both servers support auto-reload
# Backend: nodemon watches .ts files
# Frontend: Vite HMR is automatic
# Just save and refresh!
```

---

## Git Workflow

### Ignore Files

```bash
# Already in .gitignore:
node_modules/
dist/
*.log
data/portfolio.db
.env (but commit .env.example)
```

### Commit Everything

```bash
git add .
git commit -m "Add production-ready backend"
git push
```

---

## Quick Reference Card

```
BACKEND              | FRONTEND
─────────────────────┼──────────────────────
cd server            | cd app
npm install          | npm install
npm run migrate      | (setup .env.local)
npm run init-admin   | (add API_URL)
npm run seed         | npm run dev
npm run dev          | http://localhost:5173
http://localhost:5000|
```

---

## File Locations

```
Portfolio/
├── server/
│   ├── .env                 ← Configure here
│   ├── data/portfolio.db    ← Database (auto-created)
│   ├── src/                 ← Source code
│   └── dist/                ← Compiled JS (after build)
│
├── app/
│   ├── .env.local           ← Add API_URL here
│   ├── src/
│   └── dist/                ← Build output
│
├── BACKEND_SETUP_GUIDE.md   ← Read first!
├── INTEGRATION_GUIDE.md     ← Frontend setup
└── DATA_MODEL_REFERENCE.md  ← Data formats
```

---

## Next Steps

1. ✅ Run `cd server && npm install && npm run migrate`
2. ✅ Run `npm run init-admin` (create your admin account)
3. ✅ Run `npm run seed` (optional - load sample data)
4. ✅ Run `npm run dev` (start backend)
5. ✅ Open new terminal: `cd app && npm run dev` (start frontend)
6. 🌐 Open http://localhost:5173 in browser
7. 📚 Read `INTEGRATION_GUIDE.md` for frontend integration
8. 🚀 Deploy when ready!

---

**All commands are idempotent and safe to run multiple times!**

For detailed documentation, see:

- `BACKEND_SETUP_GUIDE.md` - Complete setup guide
- `server/README.md` - API documentation
- `INTEGRATION_GUIDE.md` - Frontend integration
- `DATA_MODEL_REFERENCE.md` - Data format reference

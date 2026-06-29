# Backend Project Structure & File Manifest

## 📦 Complete Backend Implementation

Generated backend structure with production-grade security and architecture.

---

## 📂 Directory Structure

```
Portfolio/server/
│
├── src/
│   ├── config/
│   │   └── database.ts                    ← SQLite initialization & schema
│   │
│   ├── models/
│   │   ├── ProjectModel.ts                ← Project CRUD operations
│   │   ├── EventModel.ts                  ← Event CRUD operations
│   │   ├── CertificationModel.ts          ← Certification CRUD operations
│   │   └── AdminUserModel.ts              ← User authentication & management
│   │
│   ├── routes/
│   │   ├── api.ts                         ← Public API endpoints (no auth)
│   │   ├── admin-auth.ts                  ← Login/logout/session management
│   │   └── admin-crud.ts                  ← Protected CRUD operations
│   │
│   ├── middleware/
│   │   └── index.ts                       ← Validation, auth, error handling
│   │
│   ├── schemas/
│   │   └── validation.ts                  ← Zod validation schemas
│   │
│   ├── types/
│   │   └── index.ts                       ← TypeScript type definitions
│   │
│   ├── scripts/
│   │   ├── migrate.ts                     ← Database migration runner
│   │   ├── seed.ts                        ← Sample data seeder
│   │   └── init-admin.ts                  ← Admin account initialization
│   │
│   └── index.ts                           ← Express server entry point
│
├── data/
│   └── portfolio.db                       ← SQLite database (auto-created)
│
├── node_modules/                          ← Dependencies (run npm install)
├── dist/                                  ← Compiled JavaScript (after npm run build)
│
├── .env                                   ← Environment configuration
├── .env.example                           ← Environment template
├── .gitignore                             ← Git ignore rules
├── package.json                           ← Dependencies & scripts
├── tsconfig.json                          ← TypeScript configuration
└── README.md                              ← API documentation
```

---

## 📄 File Descriptions

### Core Application

#### `src/index.ts` — Server Entry Point

- **Purpose**: Express application setup, middleware configuration, route registration
- **Imports**: All middleware, routes, config
- **Key Features**:
  - CORS configuration
  - Session management setup
  - Security headers (Helmet)
  - Request logging (Morgan)
  - Body parsing and compression
  - Error handling

#### `src/config/database.ts` — Database Configuration

- **Purpose**: SQLite connection and schema initialization
- **Key Features**:
  - Database connection with foreign key support
  - Schema creation for all tables
  - Database initialization function
  - Error handling and logging

### Models (Database Layer)

Each model provides CRUD operations for its entity:

#### `src/models/ProjectModel.ts`

- `create()` - Insert new project
- `getAll()` - Fetch all projects
- `getPaginated()` - Paginated retrieval with search
- `getById()` - Fetch single project
- `getBySlug()` - Fetch by slug (URL-friendly identifier)
- `update()` - Partial update
- `delete()` - Remove project
- `isSlugUnique()` - Validation helper

#### `src/models/EventModel.ts`

- `create()`, `getAll()`, `getPaginated()`
- `getById()`, `update()`, `delete()`
- `getByRole()` - Filter by participant/mentor/speaker

#### `src/models/CertificationModel.ts`

- `create()`, `getAll()`, `getPaginated()`
- `getById()`, `update()`, `delete()`
- `getByStatus()` - Filter by in_progress/completed

#### `src/models/AdminUserModel.ts`

- `create()` - Register admin with hashed password
- `getByUsername()` - Fetch for login
- `getById()` - Session retrieval
- `verifyPassword()` - Bcrypt comparison
- `updatePassword()` - Change password securely
- `updateLastLogin()` - Track admin activity
- `usernameExists()` - Uniqueness check

### Routes (API Layer)

#### `src/routes/api.ts` — Public API

- **Endpoints**: `/api/projects`, `/api/events`, `/api/certifications`
- **Methods**: GET (paginated and by ID)
- **Auth**: ❌ None required
- **Use**: Frontend data fetching
- **Response**: JSON with success status and data

#### `src/routes/admin-auth.ts` — Authentication

- **Endpoints**:
  - `POST /admin/login` - Authentication
  - `POST /admin/logout` - Session destruction
  - `GET /admin/session` - Current user info
- **Auth**: ✅ Protected (except login)
- **Features**:
  - Rate limiting (5 attempts/15 min)
  - Input validation
  - Session creation

#### `src/routes/admin-crud.ts` — Admin Operations

- **Endpoints**: `/admin/projects|events|certifications`
- **Methods**: POST (create), GET, PUT (update), DELETE
- **Auth**: ✅ Required (admin only)
- **Features**:
  - Full CRUD for each entity
  - Input validation per Zod schema
  - Error handling with proper HTTP status codes

### Middleware & Validation

#### `src/middleware/index.ts`

- `validate()` - Zod schema validation for request body
- `validateQuery()` - Query parameter validation
- `requireAuth()` - Session check middleware
- `requireAdmin()` - Admin role verification
- `sanitizeInput()` - XSS prevention
- `errorHandler()` - Global error handling
- `notFound()` - 404 responses

#### `src/schemas/validation.ts` — Validation Schemas

```typescript
// Project schemas
createProjectSchema;
updateProjectSchema;

// Event schemas
createEventSchema;
updateEventSchema;

// Certification schemas
createCertificationSchema;
updateCertificationSchema;

// Auth schemas
loginSchema;
changePasswordSchema;

// Pagination schema
paginationSchema;
```

### Types & Interfaces

#### `src/types/index.ts`

- `Project` - Project entity with id, title, slug, etc.
- `Event` - Event entity with role enum
- `Certification` - Certification entity
- `AdminUser` - Admin user (no password returned)
- `SessionData` - Session payload

### Scripts (Utilities)

#### `src/scripts/migrate.ts`

- Runs database initialization
- Creates all tables with proper schema
- Usage: `npm run migrate`

#### `src/scripts/seed.ts`

- Populates database with sample data
- Projects: Music Recommendation, 2FA, Carpooling
- Events: IndabaX, BWAI, IFRI
- Certifications: DataCamp, OpenClassrooms, etc.
- Usage: `npm run seed`

#### `src/scripts/init-admin.ts`

- Interactive admin account creation
- Prompts for username, password, email
- Validates password strength (min 8 chars)
- Creates bcrypt hashed entry
- Usage: `npm run init-admin`

### Configuration Files

#### `.env` — Environment Variables

```
PORT, NODE_ENV
DATABASE_PATH
SESSION_SECRET, JWT_SECRET
RATE_LIMIT settings
CORS_ORIGIN
```

#### `.env.example` — Template

Copy to `.env` and customize values.

#### `package.json` — Dependencies & Scripts

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "migrate": "ts-node src/scripts/migrate.ts",
  "seed": "ts-node src/scripts/seed.ts",
  "init-admin": "ts-node src/scripts/init-admin.ts"
}
```

Key dependencies:

- **express** - Web framework
- **better-sqlite3** - SQLite driver
- **zod** - Schema validation
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers
- **cors** - CORS middleware

#### `tsconfig.json` — TypeScript Configuration

- Target: ES2020
- Module: ES2020
- Strict mode enabled
- Source maps for debugging

#### `README.md` — API Documentation

Complete API reference with:

- Endpoint documentation
- Request/response examples
- Security features
- Installation instructions
- Troubleshooting guide

### Documentation Files (Root Level)

#### `BACKEND_SETUP_GUIDE.md`

- Quick start (5-minute setup)
- All commands explained
- Troubleshooting
- Deployment guide

#### `INTEGRATION_GUIDE.md`

- Frontend-backend integration steps
- API client service template
- Component update examples
- Running both servers

---

## 🔄 Data Flow

### Public API Request

```
Client Request
    ↓
CORS Check + Morgan Logging
    ↓
Compression Middleware
    ↓
Route Handler (api.ts)
    ↓
Model Query (e.g., ProjectModel.getAll())
    ↓
SQLite Database
    ↓
JSON Response
```

### Admin CRUD Request

```
Client Request (with session cookie)
    ↓
CORS + Logging
    ↓
Sanitize Input (XSS prevention)
    ↓
Validate Body (Zod schema)
    ↓
requireAuth Middleware (check session)
    ↓
requireAdmin Middleware (verify admin role)
    ↓
Route Handler (admin-crud.ts)
    ↓
Model Operation (Create/Update/Delete)
    ↓
Database Transaction
    ↓
JSON Response with status
```

---

## 🔒 Security Layers

| Layer                 | Implementation        | File                       |
| --------------------- | --------------------- | -------------------------- |
| **Input Validation**  | Zod schemas           | `schemas/validation.ts`    |
| **SQL Injection**     | Parameterized queries | All model files            |
| **XSS Prevention**    | Input sanitization    | `middleware/index.ts`      |
| **Brute Force**       | Rate limiting         | `routes/admin-auth.ts`     |
| **Password Security** | Bcryptjs hashing      | `models/AdminUserModel.ts` |
| **Session Security**  | HttpOnly cookies      | `index.ts` config          |
| **CORS**              | Origin whitelist      | `index.ts`                 |
| **Security Headers**  | Helmet.js             | `index.ts`                 |

---

## 📊 Database Schema

### Tables Created

1. **projects** - 11 columns with timestamps
2. **events** - 7 columns with timestamps
3. **certifications** - 8 columns with timestamps
4. **admin_users** - 7 columns with timestamps

All tables include:

- AUTO INCREMENT id
- CHECK constraints for status/role
- UNIQUE constraints for slug/username
- FOREIGN KEY support enabled
- Timestamps for audit trail

---

## 🚀 Deployment Ready

The backend is designed for easy deployment:

- ✅ Environment-based configuration
- ✅ No hardcoded secrets
- ✅ Database versioning (schema in code)
- ✅ Build process (TypeScript compilation)
- ✅ Production logging
- ✅ Error handling for all scenarios
- ✅ HTTPS/security headers support

---

## 📈 Scalability Considerations

### Future Enhancements

- [ ] Add PostgreSQL support (change models layer)
- [ ] Implement image upload handling
- [ ] Add file size validation
- [ ] Implement soft deletes
- [ ] Add audit logging
- [ ] Implement API versioning (/v1/api)
- [ ] Add GraphQL alongside REST
- [ ] Implement caching (Redis)
- [ ] Add background job queue
- [ ] Implement webhook system

All achievable by modifying models and routes without changing core architecture.

---

## ✅ Installation Verification

After setup, verify all files exist:

```bash
# Check backend structure
ls -la server/src/
ls -la server/src/models/
ls -la server/src/routes/
ls -la server/src/middleware/

# Verify config files
cat server/.env
cat server/package.json

# Test installation
npm install
npm run type-check
```

---

## 🎯 Quick Reference

| Task            | Command              |
| --------------- | -------------------- |
| Install         | `npm install`        |
| Setup DB        | `npm run migrate`    |
| Create admin    | `npm run init-admin` |
| Add sample data | `npm run seed`       |
| Dev server      | `npm run dev`        |
| Build           | `npm run build`      |
| Production      | `npm run start`      |
| Type check      | `npm run type-check` |
| Lint            | `npm run lint`       |

---

**All files are production-ready, fully typed, and documented. Happy coding! 🚀**

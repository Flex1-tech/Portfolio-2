# Frontend-Backend Integration Guide

## Overview

This guide explains how to integrate your React portfolio frontend with the new backend API.

---

## Step 1: Update Frontend Environment

Create a `.env.local` file in your `app/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Or for production:

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## Step 2: Create API Client

Create a new file `app/src/services/api.ts`:

```typescript
/**
 * API Client Service
 * Centralized API calls for all data fetching
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Fetch all projects
 */
export async function getProjects() {
  const response = await fetch(`${API_URL}/api/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json() as Promise<ApiResponse<Project[]>>;
}

/**
 * Fetch paginated projects with search
 */
export async function getProjectsPaginated(
  page = 1,
  limit = 10,
  search?: string,
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.append("search", search);

  const response = await fetch(`${API_URL}/api/projects?${params}`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}

/**
 * Fetch single project by ID
 */
export async function getProjectById(id: number) {
  const response = await fetch(`${API_URL}/api/projects/${id}`);
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json() as Promise<ApiResponse<Project>>;
}

/**
 * Fetch project by slug
 */
export async function getProjectBySlug(slug: string) {
  const response = await fetch(`${API_URL}/api/projects/slug/${slug}`);
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json() as Promise<ApiResponse<Project>>;
}

/**
 * Fetch all events
 */
export async function getEvents() {
  const response = await fetch(`${API_URL}/api/events`);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json() as Promise<ApiResponse<Event[]>>;
}

/**
 * Fetch paginated events
 */
export async function getEventsPaginated(page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(`${API_URL}/api/events?${params}`);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
}

/**
 * Fetch all certifications
 */
export async function getCertifications() {
  const response = await fetch(`${API_URL}/api/certifications`);
  if (!response.ok) throw new Error("Failed to fetch certifications");
  return response.json() as Promise<ApiResponse<Certification[]>>;
}

/**
 * Fetch paginated certifications
 */
export async function getCertificationsPaginated(page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(`${API_URL}/api/certifications?${params}`);
  if (!response.ok) throw new Error("Failed to fetch certifications");
  return response.json();
}

// ============================================================================
// ADMIN API
// ============================================================================

/**
 * Admin login
 */
export async function adminLogin(username: string, password: string) {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important: include cookies for session
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json() as Promise<
    ApiResponse<{ id: number; username: string; email?: string }>
  >;
}

/**
 * Admin logout
 */
export async function adminLogout() {
  const response = await fetch(`${API_URL}/admin/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Logout failed");
  return response.json();
}

/**
 * Get current session
 */
export async function getSession() {
  const response = await fetch(`${API_URL}/admin/session`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to get session");
  return response.json();
}

// Projects Admin CRUD
export async function createProject(data: any) {
  const response = await fetch(`${API_URL}/admin/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create project");
  }
  return response.json();
}

export async function updateProject(id: number, data: any) {
  const response = await fetch(`${API_URL}/admin/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

export async function deleteProject(id: number) {
  const response = await fetch(`${API_URL}/admin/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return response.json();
}

// Events Admin CRUD
export async function createEvent(data: any) {
  const response = await fetch(`${API_URL}/admin/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create event");
  return response.json();
}

export async function updateEvent(id: number, data: any) {
  const response = await fetch(`${API_URL}/admin/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update event");
  return response.json();
}

export async function deleteEvent(id: number) {
  const response = await fetch(`${API_URL}/admin/events/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete event");
  return response.json();
}

// Certifications Admin CRUD
export async function createCertification(data: any) {
  const response = await fetch(`${API_URL}/admin/certifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create certification");
  return response.json();
}

export async function updateCertification(id: number, data: any) {
  const response = await fetch(`${API_URL}/admin/certifications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update certification");
  return response.json();
}

export async function deleteCertification(id: number) {
  const response = await fetch(`${API_URL}/admin/certifications/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete certification");
  return response.json();
}
```

---

## Step 3: Update Section Components

Replace hardcoded data with API calls. Example for `ProjectsSection.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { getProjects } from '@/services/api';
import type { Project } from '@/types';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await getProjects();
        if (response.success) {
          setProjects(response.data || []);
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section id="projects" className="...">
      {/* Your existing JSX, using projects state instead of PROJECTS constant */}
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </section>
  );
}
```

Do the same for `CertificationsSection.tsx` and `CommunitySection.tsx`.

---

## Step 4: Update Frontend Types

Update `app/src/types/index.ts` to include `id`:

```typescript
export interface Project {
  id?: number;
  number?: string;
  title: string;
  status: "completed" | "in-progress";
  problem: string;
  solution: string;
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  image: string;
}

export interface Certification {
  id?: number;
  platform: string;
  title: string;
  status: "completed" | "in-progress";
  verifyUrl?: string;
}

export interface Event {
  id?: number;
  title: string;
  organization: string;
  role: "participant" | "mentor" | "speaker";
  description: string;
  year: string;
}
```

---

## Step 5: Running Both Servers

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd app
npm run dev
# Frontend running on http://localhost:5173
```

---

## Step 6: Testing the Integration

1. **Ensure backend is running and seeded:**

   ```bash
   npm run seed
   ```

2. **Check API response:**

   ```bash
   curl http://localhost:5000/api/projects
   ```

3. **View projects in browser:**
   Navigate to `http://localhost:5173` and check the Projects section

4. **Check browser console** for any CORS or network errors

---

## Troubleshooting

### CORS Error

If you see: `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Check that `CORS_ORIGIN` in `server/.env` includes your frontend URL:

```env
CORS_ORIGIN=http://localhost:5173
```

### Data Not Loading

1. Ensure backend is running: `npm run dev` in server folder
2. Check that database is initialized: `npm run migrate` then `npm run seed`
3. Open browser DevTools → Network tab to see actual API responses

### Session Not Persisting

Add `credentials: 'include'` to all fetch calls (already done in the API service above).

---

## Deployment

### Backend Deployment (Example: Heroku, Railway, Fly.io)

1. **Update `.env` for production:**

   ```env
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   SESSION_SECRET=[generate-strong-random-string]
   ```

2. **Build and deploy:**

   ```bash
   npm run build
   ```

3. **Run migrations on production:**

   ```bash
   npm run migrate
   ```

4. **Create admin user on production server**

### Frontend Deployment (Example: Vercel, Netlify)

1. **Update `app/.env.production`:**

   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

2. **Deploy to your hosting platform**

---

## Next Steps

1. ✅ Backend is set up and running
2. ✅ API endpoints are available
3. **TODO:** Create admin dashboard UI for CRUD operations
4. **TODO:** Deploy backend and frontend
5. **TODO:** Set up proper database backups

Enjoy your new backend-powered portfolio! 🚀

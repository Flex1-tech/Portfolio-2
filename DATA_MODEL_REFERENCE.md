# Data Model Reference & Frontend Compatibility

## Overview

This document maps the backend data models to frontend TypeScript types, ensuring seamless integration.

---

## 1. Projects

### Backend Model

```typescript
// Backend response from API
{
  id: number;
  title: string;
  slug: string;
  short_desc: string;
  core_problem: string;
  technical_solution: string;
  tech_stack: string[];  // JSON array in DB, parsed to array
  github_link?: string;
  live_demo_link?: string;
  status: 'in_progress' | 'completed';
  created_at: string;    // ISO timestamp
  updated_at: string;    // ISO timestamp
}
```

### Frontend Type

```typescript
// Update app/src/types/index.ts
export interface Project {
  id?: number;
  number?: string; // From slug or index
  title: string;
  slug?: string; // NEW: for details page routing
  short_desc?: string; // NEW: short description
  problem: string; // Maps to core_problem
  solution: string; // Maps to technical_solution
  tech: string[]; // Maps to tech_stack
  githubUrl?: string; // Maps to github_link
  demoUrl?: string; // Maps to live_demo_link
  status?: "completed" | "in-progress";
  image: string; // TODO: add image field to backend
  created_at?: string;
  updated_at?: string;
}
```

### API Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Music Recommendation Engine",
      "slug": "music-recommendation-engine",
      "short_desc": "AI-powered music recommendation system",
      "core_problem": "Recommending music locally without internet...",
      "technical_solution": "Built an audio embedding pipeline...",
      "tech_stack": ["Python", "MusiCNN", "CNN14", "ONNX", "NumPy", "VLC"],
      "github_link": "https://github.com/Flex1-tech",
      "live_demo_link": "https://musirecommender.netlify.app/",
      "status": "completed",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Frontend Component Integration

```typescript
import { useEffect, useState } from 'react';
import { getProjects } from '@/services/api';
import type { Project } from '@/types';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects()
      .then(res => {
        const apiProjects = res.data || [];
        // Map backend format to frontend format
        const mapped = apiProjects.map((p: any, i: number) => ({
          ...p,
          number: String(i + 1).padStart(2, '0'),
          problem: p.core_problem,
          solution: p.technical_solution,
          tech: p.tech_stack,
          githubUrl: p.github_link,
          demoUrl: p.live_demo_link,
          image: p.image || '/images/projects/default.jpg', // Default image
        }));
        setProjects(mapped);
      });
  }, []);

  return (
    <section id="projects">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </section>
  );
}
```

---

## 2. Events (Community)

### Backend Model

```typescript
{
  id: number;
  title: string;
  organization: string;
  year: string; // "2025" or "2024 – Present"
  role: "participant" | "mentor" | "speaker";
  description: string;
  created_at: string;
  updated_at: string;
}
```

### Frontend Type

```typescript
export interface Event {
  id?: number;
  title: string;
  organization: string;
  role: "participant" | "mentor" | "speaker";
  description: string;
  year: string; // "2025" or "2024 – Present"
  created_at?: string;
  updated_at?: string;
}
```

### API Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "IndabaX Benin 2025",
      "organization": "IndabaX — African AI Research Community",
      "year": "2025",
      "role": "participant",
      "description": "Technical sessions and workshops on Deep Learning...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Frontend Component Integration

```typescript
import { useEffect, useState } from 'react';
import { getEvents } from '@/services/api';
import type { Event } from '@/types';

export default function CommunitySection() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents()
      .then(res => setEvents(res.data || []))
      .catch(err => console.error('Error loading events:', err));
  }, []);

  return (
    <section id="community">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
```

---

## 3. Certifications

### Backend Model

```typescript
{
  id: number;
  platform: string;        // "DataCamp", "Coursera", etc.
  title: string;
  status: 'in_progress' | 'completed';
  credential_url?: string;
  date_earned?: string;    // ISO date: "2024-01-01"
  created_at: string;
  updated_at: string;
}
```

### Frontend Type

```typescript
export interface Certification {
  id?: number;
  platform: string;
  title: string;
  status: "completed" | "in-progress";
  verifyUrl?: string; // Maps to credential_url
  date_earned?: string;
  created_at?: string;
  updated_at?: string;
}
```

### API Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "platform": "DataCamp",
      "title": "Associate Data Scientist in Python",
      "status": "in-progress",
      "credential_url": "https://www.datacamp.com",
      "date_earned": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Frontend Component Integration

```typescript
import { useEffect, useState } from 'react';
import { getCertifications } from '@/services/api';
import type { Certification } from '@/types';

export default function CertificationsSection() {
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    getCertifications()
      .then(res => {
        const mapped = (res.data || []).map((c: any) => ({
          ...c,
          verifyUrl: c.credential_url, // Map credential_url to verifyUrl
        }));
        setCerts(mapped);
      })
      .catch(err => console.error('Error loading certifications:', err));
  }, []);

  return (
    <section id="certifications">
      {certs.map(cert => (
        <CertificationRow key={cert.id} cert={cert} />
      ))}
    </section>
  );
}
```

---

## 4. Admin Authentication

### Login Endpoint

```typescript
// POST /admin/login
// Request
{
  username: string;
  password: string;
}

// Response
{
  success: true;
  message: "Login successful";
  user: {
    id: number;
    username: string;
    email?: string;
  }
}
```

### Admin CRUD Operations

#### Create Project

```typescript
// POST /admin/projects
// Request
{
  title: string;
  slug: string;
  short_desc: string;
  core_problem: string;
  technical_solution: string;
  tech_stack: string[];
  github_link?: string;
  live_demo_link?: string;
  status: 'in_progress' | 'completed';
}

// Response
{
  success: true;
  message: "Project created successfully";
  data: { /* full project object */ }
}
```

#### Update Project

```typescript
// PUT /admin/projects/:id
// Request (all fields optional)
{
  title?: string;
  status?: 'in_progress' | 'completed';
  // ... other fields
}

// Response
{
  success: true;
  message: "Project updated successfully";
  data: { /* updated project object */ }
}
```

#### Delete Project

```typescript
// DELETE /admin/projects/:id
// Response
{
  success: true;
  message: "Project deleted successfully";
}
```

---

## 5. Field Mapping Reference

### Projects

| Backend              | Frontend     | Notes                        |
| -------------------- | ------------ | ---------------------------- |
| `core_problem`       | `problem`    | Full problem statement       |
| `technical_solution` | `solution`   | How it was solved            |
| `tech_stack`         | `tech`       | Array of technologies        |
| `github_link`        | `githubUrl`  | GitHub repository URL        |
| `live_demo_link`     | `demoUrl`    | Live deployment URL          |
| `slug`               | `slug`       | URL-friendly identifier      |
| `short_desc`         | `short_desc` | One-line description         |
| `status`             | `status`     | 'completed' or 'in-progress' |

### Events

| Backend              | Frontend       | Notes                    |
| -------------------- | -------------- | ------------------------ |
| All fields match 1:1 | Direct mapping | No transformation needed |

### Certifications

| Backend          | Frontend      | Notes                    |
| ---------------- | ------------- | ------------------------ |
| `credential_url` | `verifyUrl`   | URL to verify credential |
| `date_earned`    | `date_earned` | ISO date string          |
| All others       | 1:1 mapping   | Direct                   |

---

## 6. Data Transformation Example

When fetching from API, transform to match frontend types:

```typescript
// API Service (app/src/services/api.ts)
export async function getProjects() {
  const response = await fetch(`${API_URL}/api/projects`);
  const json = await response.json();

  if (!json.success) throw new Error("Failed to fetch projects");

  // Transform backend format to frontend format
  return json.data.map((project: any, index: number) => ({
    ...project,
    number: String(index + 1).padStart(2, "0"),
    problem: project.core_problem,
    solution: project.technical_solution,
    tech: project.tech_stack,
    githubUrl: project.github_link,
    demoUrl: project.live_demo_link,
    image: project.image || `/images/projects/project-${index + 1}.jpg`,
  }));
}
```

---

## 7. Validation Rules

### Frontend Validation (Optional, matches backend)

```typescript
// zod schema for frontend (optional)
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  tech_stack: z.array(z.string()).min(1),
  status: z.enum(["in_progress", "completed"]),
});

// Use in forms
const {
  register,
  formState: { errors },
} = useForm({
  resolver: zodResolver(projectSchema),
});
```

---

## 8. Error Handling

Backend returns consistent error format:

```typescript
// Validation Error
{
  success: false;
  message: "Validation error";
  errors: [
    {
      field: "tech_stack";
      message: "At least one technology is required";
    }
  ]
}

// Not Found
{
  success: false;
  message: "Project not found";
}

// Server Error
{
  success: false;
  message: "An error occurred";
}
```

Handle in frontend:

```typescript
try {
  const response = await getProjects();
  if (!response.success) {
    throw new Error(response.message);
  }
  setProjects(response.data);
} catch (error) {
  console.error("Error:", error);
  showErrorNotification(error.message);
}
```

---

## 9. Image Handling

Currently, images are stored as:

- **Path**: `/images/projects/` in public folder
- **Frontend**: Hardcoded URLs like `/images/projects/music.jpg`

### Future Enhancement

Add image field to backend:

```typescript
// Add to projects table
image: string;  // URL or file path
image_alt: string;  // Alt text for accessibility

// API response would include:
{
  id: 1,
  title: "...",
  image: "/images/projects/music.jpg",
  image_alt: "Music recommendation engine interface",
  // ...
}
```

---

## 10. Pagination

### Query Parameters

```
GET /api/projects?page=1&limit=10&search=music

// Response
{
  success: true;
  data: {
    projects: [ /* 10 items */ ];
    total: 42;
    page: 1;
    pages: 5;
  }
}
```

### Frontend Usage

```typescript
const [page, setPage] = useState(1);
const [projects, setProjects] = useState([]);

useEffect(() => {
  getProjectsPaginated(page, 10)
    .then(res => setProjects(res.data.projects));
}, [page]);

return (
  <>
    {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    <Pagination
      current={page}
      total={res.data.pages}
      onPageChange={setPage}
    />
  </>
);
```

---

## 11. Quick Integration Checklist

- [ ] Update `app/src/types/index.ts` with new interfaces
- [ ] Create `app/src/services/api.ts` with fetch functions
- [ ] Add `.env.local` with `VITE_API_URL`
- [ ] Update `ProjectsSection.tsx` to use `getProjects()`
- [ ] Update `CertificationsSection.tsx` to use `getCertifications()`
- [ ] Update `CommunitySection.tsx` to use `getEvents()`
- [ ] Add error states and loading indicators
- [ ] Test with backend running
- [ ] Verify data displays correctly

---

**Ready to integrate! 🚀**

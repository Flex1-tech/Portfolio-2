/**
 * API Service - Frontend Integration with Backend
 * Communicates with Express backend at http://localhost:5000 (dev) or relative paths (prod via Render rewrites)
 */

const API_URL = '';

// ============================================================================
// Types
// ============================================================================

export interface Project {
 id: number;
 title: string;
 slug: string;
 short_desc: string;
 core_problem: string;
 technical_solution: string;
 tech_stack: string[];
 github_link?: string;
 live_demo_link?: string;
 image_url?: string;
 video_url?: string;
 status: "in_progress" | "completed";
 created_at: string;
 updated_at: string;
}

export interface Event {
 id: number;
 title: string;
 organization: string;
 year: string;
 role: "participant" | "mentor" | "speaker";
 description: string;
 image_url?: string;
 created_at: string;
 updated_at: string;
}

export interface Certification {
 id: number;
 platform: string;
 title: string;
 status: "in_progress" | "completed";
 credential_url?: string;
 image_url?: string;
 date_earned?: string;
 created_at: string;
 updated_at: string;
}

export interface ApiResponse<T> {
 success: boolean;
 data?: T;
 message?: string;
 error?: string;
}

// ============================================================================
// Projects API
// ============================================================================

/**
 * Get all projects
 */
export async function getProjects(): Promise<Project[]> {
 try {
 const response = await fetch(`${API_URL}/api/projects`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch projects: ${response.statusText}`);
 }

 const data: ApiResponse<Project[]> = await response.json();
 return data.data || [];
 } catch (error) {
 console.error("Error fetching projects:", error);
 return [];
 }
}

/**
 * Get paginated projects with optional search
 */
export async function getProjectsPaginated(
 page: number = 1,
 limit: number = 10,
 search?: string,
): Promise<{ projects: Project[]; total: number; pages: number }> {
 try {
 const params = new URLSearchParams({
 page: String(page),
 limit: String(limit),
 ...(search && { search }),
 });

 const response = await fetch(`${API_URL}/api/projects?${params}`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch projects: ${response.statusText}`);
 }

 const data: ApiResponse<{
 projects: Project[];
 total: number;
 pages: number;
 }> = await response.json();
 return data.data || { projects: [], total: 0, pages: 0 };
 } catch (error) {
 console.error("Error fetching paginated projects:", error);
 return { projects: [], total: 0, pages: 0 };
 }
}

/**
 * Get single project by ID
 */
export async function getProjectById(id: number): Promise<Project | null> {
 try {
 const response = await fetch(`${API_URL}/api/projects/${id}`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch project: ${response.statusText}`);
 }

 const data: ApiResponse<Project> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error fetching project:", error);
 return null;
 }
}

/**
 * Get single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
 try {
 const response = await fetch(`${API_URL}/api/projects/slug/${slug}`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch project: ${response.statusText}`);
 }

 const data: ApiResponse<Project> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error fetching project:", error);
 return null;
 }
}

// ============================================================================
// Events API
// ============================================================================

/**
 * Get all events
 */
export async function getEvents(): Promise<Event[]> {
 try {
 const response = await fetch(`${API_URL}/api/events`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch events: ${response.statusText}`);
 }

 const data: ApiResponse<Event[]> = await response.json();
 return data.data || [];
 } catch (error) {
 console.error("Error fetching events:", error);
 return [];
 }
}

/**
 * Get paginated events
 */
export async function getEventsPaginated(
 page: number = 1,
 limit: number = 10,
): Promise<{ events: Event[]; total: number; pages: number }> {
 try {
 const params = new URLSearchParams({
 page: String(page),
 limit: String(limit),
 });

 const response = await fetch(`${API_URL}/api/events?${params}`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch events: ${response.statusText}`);
 }

 const data: ApiResponse<{ events: Event[]; total: number; pages: number }> =
 await response.json();
 return data.data || { events: [], total: 0, pages: 0 };
 } catch (error) {
 console.error("Error fetching paginated events:", error);
 return { events: [], total: 0, pages: 0 };
 }
}

/**
 * Get single event by ID
 */
export async function getEventById(id: number): Promise<Event | null> {
 try {
 const response = await fetch(`${API_URL}/api/events/${id}`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch event: ${response.statusText}`);
 }

 const data: ApiResponse<Event> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error fetching event:", error);
 return null;
 }
}

// ============================================================================
// Certifications API
// ============================================================================

/**
 * Get all certifications
 */
export async function getCertifications(): Promise<Certification[]> {
 try {
 const response = await fetch(`${API_URL}/api/certifications`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch certifications: ${response.statusText}`);
 }

 const data: ApiResponse<Certification[]> = await response.json();
 return data.data || [];
 } catch (error) {
 console.error("Error fetching certifications:", error);
 return [];
 }
}

/**
 * Get paginated certifications
 */
export async function getCertificationsPaginated(
 page: number = 1,
 limit: number = 10,
): Promise<{ certifications: Certification[]; total: number; pages: number }> {
 try {
 const params = new URLSearchParams({
 page: String(page),
 limit: String(limit),
 });

 const response = await fetch(`${API_URL}/api/certifications?${params}`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch certifications: ${response.statusText}`);
 }

 const data: ApiResponse<{
 certifications: Certification[];
 total: number;
 pages: number;
 }> = await response.json();
 return data.data || { certifications: [], total: 0, pages: 0 };
 } catch (error) {
 console.error("Error fetching paginated certifications:", error);
 return { certifications: [], total: 0, pages: 0 };
 }
}

/**
 * Get single certification by ID
 */
export async function getCertificationById(
 id: number,
): Promise<Certification | null> {
 try {
 const response = await fetch(`${API_URL}/api/certifications/${id}`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error(`Failed to fetch certification: ${response.statusText}`);
 }

 const data: ApiResponse<Certification> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error fetching certification:", error);
 return null;
 }
}

// ============================================================================
// Admin Authentication (Optional)
// ============================================================================

/**
 * Login to admin dashboard
 */
export async function adminLogin(
 username: string,
 password: string,
): Promise<{ success: boolean; message?: string }> {
 try {
    const response = await fetch(`${API_URL}/admin-api/login`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 body: JSON.stringify({ username, password }),
 });

    const data: ApiResponse<unknown> = await response.json();

    if (!response.ok) {
 throw new Error(data.message || "Login failed");
 }

 return { success: true, message: data.message };
 } catch (error) {
 console.error("Error logging in:", error);
 return { success: false, message: String(error) };
 }
}

/**
 * Logout from admin dashboard
 */
export async function adminLogout(): Promise<{ success: boolean }> {
 try {
 const response = await fetch(`${API_URL}/admin-api/logout`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

 if (!response.ok) {
 throw new Error("Logout failed");
 }

 return { success: true };
 } catch (error) {
 console.error("Error logging out:", error);
 return { success: false };
 }
}

/**
 * Get current admin session
 */
export async function getAdminSession(): Promise<{
 id: number;
 username: string;
 email: string;
} | null> {
 try {
    const response = await fetch(`${API_URL}/admin-api/session`, {
 method: "GET",
 headers: {
 "Content-Type": "application/json",
 },
 credentials: "include",
 });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || null;
 } catch (error) {
 console.error("Error fetching session:", error);
 return null;
 }
}

// ============================================================================
// Admin CRUD API Functions
// ============================================================================

/**
 * Create project
 */
export async function createProject(
 project: Omit<Project, "id" | "created_at" | "updated_at"> | FormData,
): Promise<Project | null> {
 try {
 const isFormData = project instanceof FormData;
 const response = await fetch(`${API_URL}/admin-api/projects`, {
 method: "POST",
 headers: isFormData ? {} : { "Content-Type": "application/json" },
 credentials: "include",
 body: isFormData ? project : JSON.stringify(project),
 });

 if (!response.ok) throw new Error("Failed to create project");

 const data: ApiResponse<Project> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error creating project:", error);
 return null;
 }
}

/**
 * Update project
 */
export async function updateProject(
 id: number,
 updates: Partial<Project> | FormData,
): Promise<Project | null> {
 try {
 const isFormData = updates instanceof FormData;
 const response = await fetch(`${API_URL}/admin-api/projects/${id}`, {
 method: "PUT",
 headers: isFormData ? {} : { "Content-Type": "application/json" },
 credentials: "include",
 body: isFormData ? updates : JSON.stringify(updates),
 });

 if (!response.ok) throw new Error("Failed to update project");

 const data: ApiResponse<Project> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error updating project:", error);
 return null;
 }
}

/**
 * Delete project
 */
export async function deleteProject(id: number): Promise<boolean> {
 try {
 const response = await fetch(`${API_URL}/admin-api/projects/${id}`, {
 method: "DELETE",
 credentials: "include",
 });

 if (!response.ok) throw new Error("Failed to delete project");

 return true;
 } catch (error) {
 console.error("Error deleting project:", error);
 return false;
 }
}

/**
 * Create event
 */
export async function createEvent(
 event: Omit<Event, "id" | "created_at" | "updated_at"> | FormData,
): Promise<Event | null> {
 try {
 const isFormData = event instanceof FormData;
 const response = await fetch(`${API_URL}/admin-api/events`, {
 method: "POST",
 headers: isFormData ? {} : { "Content-Type": "application/json" },
 credentials: "include",
 body: isFormData ? event : JSON.stringify(event),
 });

 if (!response.ok) throw new Error("Failed to create event");

 const data: ApiResponse<Event> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error creating event:", error);
 return null;
 }
}

/**
 * Update event
 */
export async function updateEvent(
 id: number,
 updates: Partial<Event> | FormData,
): Promise<Event | null> {
 try {
 const isFormData = updates instanceof FormData;
 const response = await fetch(`${API_URL}/admin-api/events/${id}`, {
 method: "PUT",
 headers: isFormData ? {} : { "Content-Type": "application/json" },
 credentials: "include",
 body: isFormData ? updates : JSON.stringify(updates),
 });

 if (!response.ok) throw new Error("Failed to update event");

 const data: ApiResponse<Event> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error updating event:", error);
 return null;
 }
}

/**
 * Delete event
 */
export async function deleteEvent(id: number): Promise<boolean> {
 try {
 const response = await fetch(`${API_URL}/admin-api/events/${id}`, {
 method: "DELETE",
 credentials: "include",
 });

 if (!response.ok) throw new Error("Failed to delete event");

 return true;
 } catch (error) {
 console.error("Error deleting event:", error);
 return false;
 }
}

/**
 * Create certification
 */
export async function createCertification(
 cert: Omit<Certification, "id" | "created_at" | "updated_at"> | FormData,
): Promise<Certification | null> {
 try {
 const isFormData = cert instanceof FormData;
 const response = await fetch(`${API_URL}/admin-api/certifications`, {
 method: "POST",
 headers: isFormData ? {} : { "Content-Type": "application/json" },
 credentials: "include",
 body: isFormData ? cert : JSON.stringify(cert),
 });

 if (!response.ok) throw new Error("Failed to create certification");

 const data: ApiResponse<Certification> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error creating certification:", error);
 return null;
 }
}

/**
 * Update certification
 */
export async function updateCertification(
 id: number,
 updates: Partial<Certification> | FormData,
): Promise<Certification | null> {
 try {
 const isFormData = updates instanceof FormData;
 const response = await fetch(`${API_URL}/admin-api/certifications/${id}`, {
 method: "PUT",
 headers: isFormData ? {} : { "Content-Type": "application/json" },
 credentials: "include",
 body: isFormData ? updates : JSON.stringify(updates),
 });

 if (!response.ok) throw new Error("Failed to update certification");

 const data: ApiResponse<Certification> = await response.json();
 return data.data || null;
 } catch (error) {
 console.error("Error updating certification:", error);
 return null;
 }
}

/**
 * Delete certification
 */
export async function deleteCertification(id: number): Promise<boolean> {
 try {
 const response = await fetch(`${API_URL}/admin-api/certifications/${id}`, {
 method: "DELETE",
 credentials: "include",
 });

 if (!response.ok) throw new Error("Failed to delete certification");

 return true;
 } catch (error) {
 console.error("Error deleting certification:", error);
 return false;
 }
}

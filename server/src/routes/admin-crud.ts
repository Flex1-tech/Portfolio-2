/**
 * Admin CRUD Routes for Projects, Events, and Certifications
 */

import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { ProjectModel } from "../models/ProjectModel.js";
import { EventModel } from "../models/EventModel.js";
import { CertificationModel } from "../models/CertificationModel.js";
import { ProfileModel } from "../models/ProfileModel.js";
import { AdminUserModel } from "../models/AdminUserModel.js";
import { pool } from "../config/database.js";
import { uploadSingle, uploadFields, uploadCV } from "../middleware/upload.js";
import {
 createProjectSchema,
 updateProjectSchema,
 createEventSchema,
 updateEventSchema,
 createCertificationSchema,
 updateCertificationSchema,
} from "../schemas/validation.js";
import {
 validate,
 requireAuth,
 requireAdmin,
 sanitizeInput,
} from "../middleware/index.js";

const router = Router();

// Rate limiting for CRUD operations
const crudLimiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // Limit each IP to 100 requests per windowMs
 message: {
 success: false,
 message: "Too many requests, please try again later.",
 },
 standardHeaders: true,
 legacyHeaders: false,
});

// Apply authentication, admin, and rate limiting middleware to all routes
router.use(requireAuth, requireAdmin, crudLimiter, sanitizeInput);

// ============================================================================
// PROJECTS CRUD
// ============================================================================

/**
 * POST /admin/projects - Create new project
 */
router.post(
 "/projects",
 uploadFields([
   { name: "image", maxCount: 1 },
   { name: "video", maxCount: 1 },
 ], "projects"),
 validate(createProjectSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const { slug } = req.body;

 // Check slug uniqueness
 if (!(await ProjectModel.isSlugUnique(slug))) {
 res.status(400).json({
 success: false,
 message: "Slug already exists",
 });
 return;
 }

 const project = await ProjectModel.create(req.body);
 res.status(201).json({
 success: true,
 message: "Project created successfully",
 data: project,
 });
 } catch (error) {
 console.error("Error creating project:", error);
 res.status(500).json({
 success: false,
 message: "Failed to create project",
 });
 }
 },
);

/**
 * GET /admin/projects - Get all projects (for admin panel)
 */
router.get("/projects", async (req: Request, res: Response): Promise<void> => {
 try {
 const projects = await ProjectModel.getAll();
 res.json({
 success: true,
 data: projects,
 });
 } catch (error) {
 console.error("Error fetching projects:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch projects",
 });
 }
});

/**
 * GET /admin/projects/:id - Get project by ID
 */
router.get("/projects/:id", async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const project = await ProjectModel.getById(Number(id));

 if (!project) {
 res.status(404).json({
 success: false,
 message: "Project not found",
 });
 return;
 }

 res.json({
 success: true,
 data: project,
 });
 } catch (error) {
 console.error("Error fetching project:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch project",
 });
 }
});

/**
 * PUT /admin/projects/:id - Update project
 */
router.put(
 "/projects/:id",
 uploadFields([
   { name: "image", maxCount: 1 },
   { name: "video", maxCount: 1 },
 ], "projects"),
 validate(updateProjectSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const projectId = Number(id);

 const existingProject = await ProjectModel.getById(projectId);
 if (!existingProject) {
 res.status(404).json({
 success: false,
 message: "Project not found",
 });
 return;
 }

 // Check slug uniqueness if slug is being updated
 if (req.body.slug && req.body.slug !== existingProject.slug) {
 if (!(await ProjectModel.isSlugUnique(req.body.slug, projectId))) {
 res.status(400).json({
 success: false,
 message: "Slug already exists",
 });
 return;
 }
 }

 const updatedProject = await ProjectModel.update(projectId, req.body);
 res.json({
 success: true,
 message: "Project updated successfully",
 data: updatedProject,
 });
 } catch (error) {
 console.error("Error updating project:", error);
 res.status(500).json({
 success: false,
 message: "Failed to update project",
 });
 }
 },
);

/**
 * DELETE /admin/projects/:id - Delete project
 */
router.delete("/projects/:id", async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const success = await ProjectModel.delete(Number(id));

 if (!success) {
 res.status(404).json({
 success: false,
 message: "Project not found",
 });
 return;
 }

 res.json({
 success: true,
 message: "Project deleted successfully",
 });
 } catch (error) {
 console.error("Error deleting project:", error);
 res.status(500).json({
 success: false,
 message: "Failed to delete project",
 });
 }
});

// ============================================================================
// EVENTS CRUD
// ============================================================================

/**
 * POST /admin/events - Create new event
 */
router.post(
 "/events",
 uploadSingle("image", "events"),
 validate(createEventSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const event = await EventModel.create(req.body);
 res.status(201).json({
 success: true,
 message: "Event created successfully",
 data: event,
 });
 } catch (error) {
 console.error("Error creating event:", error);
 res.status(500).json({
 success: false,
 message: "Failed to create event",
 });
 }
 },
);

/**
 * GET /admin/events - Get all events
 */
router.get("/events", async (req: Request, res: Response): Promise<void> => {
 try {
 const events = await EventModel.getAll();
 res.json({
 success: true,
 data: events,
 });
 } catch (error) {
 console.error("Error fetching events:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch events",
 });
 }
});

/**
 * GET /admin/events/:id - Get event by ID
 */
router.get("/events/:id", async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const event = await EventModel.getById(Number(id));

 if (!event) {
 res.status(404).json({
 success: false,
 message: "Event not found",
 });
 return;
 }

 res.json({
 success: true,
 data: event,
 });
 } catch (error) {
 console.error("Error fetching event:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch event",
 });
 }
});

/**
 * PUT /admin/events/:id - Update event
 */
router.put(
 "/events/:id",
 uploadSingle("image", "events"),
 validate(updateEventSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const updatedEvent = await EventModel.update(Number(id), req.body);

 if (!updatedEvent) {
 res.status(404).json({
 success: false,
 message: "Event not found",
 });
 return;
 }

 res.json({
 success: true,
 message: "Event updated successfully",
 data: updatedEvent,
 });
 } catch (error) {
 console.error("Error updating event:", error);
 res.status(500).json({
 success: false,
 message: "Failed to update event",
 });
 }
 },
);

/**
 * DELETE /admin/events/:id - Delete event
 */
router.delete("/events/:id", async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const success = await EventModel.delete(Number(id));

 if (!success) {
 res.status(404).json({
 success: false,
 message: "Event not found",
 });
 return;
 }

 res.json({
 success: true,
 message: "Event deleted successfully",
 });
 } catch (error) {
 console.error("Error deleting event:", error);
 res.status(500).json({
 success: false,
 message: "Failed to delete event",
 });
 }
});

// ============================================================================
// CERTIFICATIONS CRUD
// ============================================================================

/**
 * POST /admin/certifications - Create new certification
 */
router.post(
 "/certifications",
 uploadSingle("image", "certifications"),
 validate(createCertificationSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const certification = await CertificationModel.create(req.body);
 res.status(201).json({
 success: true,
 message: "Certification created successfully",
 data: certification,
 });
 } catch (error) {
 console.error("Error creating certification:", error);
 res.status(500).json({
 success: false,
 message: "Failed to create certification",
 });
 }
 },
);

/**
 * GET /admin/certifications - Get all certifications
 */
router.get("/certifications", async (req: Request, res: Response): Promise<void> => {
 try {
 const certifications = await CertificationModel.getAll();
 res.json({
 success: true,
 data: certifications,
 });
 } catch (error) {
 console.error("Error fetching certifications:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch certifications",
 });
 }
});

/**
 * GET /admin/certifications/:id - Get certification by ID
 */
router.get("/certifications/:id", async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const certification = await CertificationModel.getById(Number(id));

 if (!certification) {
 res.status(404).json({
 success: false,
 message: "Certification not found",
 });
 return;
 }

 res.json({
 success: true,
 data: certification,
 });
 } catch (error) {
 console.error("Error fetching certification:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch certification",
 });
 }
});

/**
 * PUT /admin/certifications/:id - Update certification
 */
router.put(
 "/certifications/:id",
 uploadSingle("image", "certifications"),
 validate(updateCertificationSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const updatedCert = await CertificationModel.update(Number(id), req.body);

 if (!updatedCert) {
 res.status(404).json({
 success: false,
 message: "Certification not found",
 });
 return;
 }

 res.json({
 success: true,
 message: "Certification updated successfully",
 data: updatedCert,
 });
 } catch (error) {
 console.error("Error updating certification:", error);
 res.status(500).json({
 success: false,
 message: "Failed to update certification",
 });
 }
 },
);

/**
 * DELETE /admin/certifications/:id - Delete certification
 */
router.delete("/certifications/:id", async (req: Request, res: Response): Promise<void> => {
 try {
 const { id } = req.params;
 const success = await CertificationModel.delete(Number(id));

 if (!success) {
 res.status(404).json({
 success: false,
 message: "Certification not found",
 });
 return;
 }

 res.json({
 success: true,
 message: "Certification deleted successfully",
 });
 } catch (error) {
 console.error("Error deleting certification:", error);
 res.status(500).json({
 success: false,
 message: "Failed to delete certification",
 });
 }
});
// ============================================================================
// PROFILE SETTINGS
// ============================================================================

/**
 * GET /admin/profile - Get all profile settings
 */
router.get("/profile", async (_req: Request, res: Response): Promise<void> => {
 try {
  const settings = await ProfileModel.getAll();
  res.json({ success: true, data: settings });
 } catch (error) {
  console.error("Error fetching profile settings:", error);
  res.status(500).json({ success: false, message: "Failed to fetch profile settings" });
 }
});

/**
 * PATCH /admin/profile - Update profile settings (bulk key-value)
 */
router.patch("/profile", async (req: Request, res: Response): Promise<void> => {
 try {
  const updates = req.body as Record<string, string>;
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
   res.status(400).json({ success: false, message: "Body must be a key-value object" });
   return;
  }
  const updated = await ProfileModel.setMany(updates);
  res.json({ success: true, message: "Profile updated successfully", data: updated });
 } catch (error) {
  console.error("Error updating profile settings:", error);
  res.status(500).json({ success: false, message: "Failed to update profile settings" });
 }
});

/**
 * POST /admin/profile/cv - Upload CV file
 */
router.post(
  "/profile/cv",
  uploadCV("cv", "portfolio/cv"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cvUrl = req.body.cv_url;
      if (!cvUrl) {
        res.status(400).json({ success: false, message: "No CV file uploaded or processing failed" });
        return;
      }
      await ProfileModel.setMany({ cv_url: cvUrl });
      res.json({
        success: true,
        message: "CV uploaded successfully",
        data: { cv_url: cvUrl }
      });
    } catch (error) {
      console.error("Error saving CV URL:", error);
      res.status(500).json({ success: false, message: "Failed to save CV URL" });
    }
  }
);

// ============================================================================
// GENERIC REORDERING
// ============================================================================

/**
 * POST /admin/reorder
 * Transactional reordering of any whitelisted resource.
 * Body: { resource: 'projects'|'events'|'certifications', orders: [{id, order_index}] }
 */
router.post("/reorder", async (req: Request, res: Response): Promise<void> => {
  const ALLOWED = ["projects", "events", "certifications"];
  const { resource, orders } = req.body;

  if (!ALLOWED.includes(resource)) {
    res.status(400).json({ success: false, message: "Invalid resource type" });
    return;
  }
  if (!Array.isArray(orders) || orders.length === 0) {
    res.status(400).json({ success: false, message: "orders must be a non-empty array" });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of orders) {
      const id = Number(item.id);
      const idx = Number(item.order_index);
      if (!Number.isInteger(id) || !Number.isInteger(idx)) throw new Error("Invalid values");
      await client.query(`UPDATE ${resource} SET order_index=$1 WHERE id=$2`, [idx, id]);
    }
    await client.query("COMMIT");
    res.json({ success: true, message: `${resource} reordered` });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Reorder error:", err);
    res.status(500).json({ success: false, message: "Failed to reorder" });
  } finally {
    client.release();
  }
});

// ============================================================================
// ADMIN USER MANAGEMENT
// ============================================================================

/**
 * GET /admin/users — list all admin accounts (passwords excluded)
 */
router.get("/users", async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await AdminUserModel.getAll();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch admins" });
  }
});

/**
 * POST /admin/users — create a new admin
 * Body: { username, password, email? }
 */
router.post("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body as { username: string; password: string; email?: string };

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
      return;
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      return;
    }

    const exists = await AdminUserModel.usernameExists(username.trim());
    if (exists) {
      res.status(409).json({ success: false, message: "Username already exists" });
      return;
    }

    const user = await AdminUserModel.create(username.trim(), password, email?.trim() || undefined);
    res.status(201).json({ success: true, data: user, message: "Admin created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create admin" });
  }
});

/**
 * DELETE /admin/users/:id — remove an admin account
 * Cannot delete yourself (session) or the primary admin (id=1)
 */
router.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const targetId = Number(req.params.id);
    const sessionUserId = (req.session as any)?.user?.id;

    if (targetId === 1) {
      res.status(403).json({ success: false, message: "Cannot delete the primary admin" });
      return;
    }
    if (sessionUserId && targetId === Number(sessionUserId)) {
      res.status(403).json({ success: false, message: "Cannot delete your own account" });
      return;
    }

    const ok = await AdminUserModel.delete(targetId);
    if (!ok) {
      res.status(404).json({ success: false, message: "Admin not found" });
      return;
    }
    res.json({ success: true, message: "Admin deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete admin" });
  }
});

export default router;

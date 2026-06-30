/**
 * Admin CRUD Routes for Projects, Events, and Certifications
 */

import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { ProjectModel } from "../models/ProjectModel.js";
import { EventModel } from "../models/EventModel.js";
import { CertificationModel } from "../models/CertificationModel.js";
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
 validate(createProjectSchema),
 (req: Request, res: Response): void => {
 try {
 const { slug } = req.body;

 // Check slug uniqueness
 if (!ProjectModel.isSlugUnique(slug)) {
 res.status(400).json({
 success: false,
 message: "Slug already exists",
 });
 return;
 }

 const project = ProjectModel.create(req.body);
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
router.get("/projects", (req: Request, res: Response) => {
 try {
 const projects = ProjectModel.getAll();
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
router.get("/projects/:id", (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const project = ProjectModel.getById(Number(id));

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
 validate(updateProjectSchema),
 (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const projectId = Number(id);

 const existingProject = ProjectModel.getById(projectId);
 if (!existingProject) {
 res.status(404).json({
 success: false,
 message: "Project not found",
 });
 return;
 }

 // Check slug uniqueness if slug is being updated
 if (req.body.slug && req.body.slug !== existingProject.slug) {
 if (!ProjectModel.isSlugUnique(req.body.slug, projectId)) {
 res.status(400).json({
 success: false,
 message: "Slug already exists",
 });
 return;
 }
 }

 const updatedProject = ProjectModel.update(projectId, req.body);
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
router.delete("/projects/:id", (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const success = ProjectModel.delete(Number(id));

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
 validate(createEventSchema),
 (req: Request, res: Response) => {
 try {
 const event = EventModel.create(req.body);
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
router.get("/events", (req: Request, res: Response) => {
 try {
 const events = EventModel.getAll();
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
router.get("/events/:id", (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const event = EventModel.getById(Number(id));

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
 validate(updateEventSchema),
 (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const updatedEvent = EventModel.update(Number(id), req.body);

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
router.delete("/events/:id", (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const success = EventModel.delete(Number(id));

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
 validate(createCertificationSchema),
 (req: Request, res: Response) => {
 try {
 const certification = CertificationModel.create(req.body);
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
router.get("/certifications", (req: Request, res: Response) => {
 try {
 const certifications = CertificationModel.getAll();
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
router.get("/certifications/:id", (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const certification = CertificationModel.getById(Number(id));

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
 validate(updateCertificationSchema),
 (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const updatedCert = CertificationModel.update(Number(id), req.body);

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
router.delete("/certifications/:id", (req: Request, res: Response): void => {
 try {
 const { id } = req.params;
 const success = CertificationModel.delete(Number(id));

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

export default router;

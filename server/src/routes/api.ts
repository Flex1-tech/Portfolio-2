/**
 * Public API Routes
 * Endpoints for frontend data consumption
 */

import { Router, Request, Response } from "express";
import { ProjectModel } from "../models/ProjectModel.js";
import { EventModel } from "../models/EventModel.js";
import { CertificationModel } from "../models/CertificationModel.js";
import { validateQuery } from "../middleware/index.js";
import { paginationSchema } from "../schemas/validation.js";

const router = Router();

/**
 * GET /api/projects - Get all projects
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
 * GET /api/projects/paginated - Get paginated projects with search
 */
router.get(
 "/projects/paginated",
 validateQuery(paginationSchema),
 (req: Request, res: Response) => {
 try {
 const { page = 1, limit = 10, search } = req.query as any;
 const result = ProjectModel.getPaginated(page, limit, search);
 res.json({
 success: true,
 data: result,
 });
 } catch (error) {
 console.error("Error fetching paginated projects:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch projects",
 });
 }
 },
);

/**
 * GET /api/projects/:id - Get project by ID
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
 * GET /api/projects/slug/:slug - Get project by slug
 */
router.get("/projects/slug/:slug", (req: Request, res: Response): void => {
 try {
 const { slug } = req.params;
 const project = ProjectModel.getBySlug(slug);

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
 console.error("Error fetching project by slug:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch project",
 });
 }
});

/**
 * GET /api/events - Get all events
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
 * GET /api/events/paginated - Get paginated events
 */
router.get(
 "/events/paginated",
 validateQuery(paginationSchema),
 (req: Request, res: Response) => {
 try {
 const { page = 1, limit = 10 } = req.query as any;
 const result = EventModel.getPaginated(page, limit);
 res.json({
 success: true,
 data: result,
 });
 } catch (error) {
 console.error("Error fetching paginated events:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch events",
 });
 }
 },
);

/**
 * GET /api/events/:id - Get event by ID
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
 * GET /api/certifications - Get all certifications
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
 * GET /api/certifications/paginated - Get paginated certifications
 */
router.get(
 "/certifications/paginated",
 validateQuery(paginationSchema),
 (req: Request, res: Response) => {
 try {
 const { page = 1, limit = 10 } = req.query as any;
 const result = CertificationModel.getPaginated(page, limit);
 res.json({
 success: true,
 data: result,
 });
 } catch (error) {
 console.error("Error fetching paginated certifications:", error);
 res.status(500).json({
 success: false,
 message: "Failed to fetch certifications",
 });
 }
 },
);

/**
 * GET /api/certifications/:id - Get certification by ID
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

export default router;

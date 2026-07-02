/**
 * Public API Routes
 * Endpoints for frontend data consumption
 */

import { Router, Request, Response } from "express";
import { ProjectModel } from "../models/ProjectModel.js";
import { EventModel } from "../models/EventModel.js";
import { CertificationModel } from "../models/CertificationModel.js";
import { ProfileModel } from "../models/ProfileModel.js";
import { validateQuery } from "../middleware/index.js";
import { paginationSchema } from "../schemas/validation.js";

const router = Router();

/**
 * GET /api/projects - Get all projects
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
 * GET /api/projects/paginated - Get paginated projects with search
 */
router.get(
 "/projects/paginated",
 validateQuery(paginationSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const { page = 1, limit = 10, search } = req.query as any;
 const result = await ProjectModel.getPaginated(page, limit, search);
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
 * GET /api/projects/slug/:slug - Get project by slug
 */
router.get("/projects/slug/:slug", async (req: Request, res: Response): Promise<void> => {
 try {
 const { slug } = req.params;
 const project = await ProjectModel.getBySlug(slug);

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
 * GET /api/events/paginated - Get paginated events
 */
router.get(
 "/events/paginated",
 validateQuery(paginationSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const { page = 1, limit = 10 } = req.query as any;
 const result = await EventModel.getPaginated(page, limit);
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
 * GET /api/certifications - Get all certifications
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
 * GET /api/certifications/paginated - Get paginated certifications
 */
router.get(
 "/certifications/paginated",
 validateQuery(paginationSchema),
 async (req: Request, res: Response): Promise<void> => {
 try {
 const { page = 1, limit = 10 } = req.query as any;
 const result = await CertificationModel.getPaginated(page, limit);
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
 * GET /api/profile - Get all profile settings
 */
router.get("/profile", async (_req: Request, res: Response): Promise<void> => {
 try {
  const settings = await ProfileModel.getAll();
  res.json({ success: true, data: settings });
 } catch (error) {
  console.error("Error fetching profile settings:", error);
  res.status(500).json({ success: false, message: "Failed to fetch profile" });
 }
});

/**
 * GET /api/profile/cv/download - Download CV with dynamic filename and PDF content type
 */
router.get("/profile/cv/download", async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await ProfileModel.getAll();
    const cvUrl = settings["cv_url"];
    const username = settings["username"] || "Seth_N_AKPLOGAN";
    const sanitizedName = username.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_");

    if (!cvUrl) {
      res.status(404).json({ success: false, message: "CV not uploaded yet" });
      return;
    }

    // Fetch the file content from Cloudinary/external storage
    const fileResponse = await fetch(cvUrl);
    if (!fileResponse.ok) {
      res.status(fileResponse.status).json({ success: false, message: "Failed to download CV file from storage" });
      return;
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="CV_${sanitizedName}.pdf"`);
    res.send(buffer);
  } catch (error) {
    console.error("Error downloading CV:", error);
    res.status(500).json({ success: false, message: "Internal server error during CV download" });
  }
});

export default router;

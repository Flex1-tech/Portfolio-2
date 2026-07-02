/**
 * Validation schemas using Zod
 * Ensures type-safe request/response validation
 */

import { z } from "zod";

// Helper to preprocess empty strings to null
const emptyToNull = z.preprocess((val) => (val === "" ? null : val), z.string().url().optional().nullable());

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  short_desc: z.string().min(10).max(500),
  core_problem: z.string().min(20).max(2000),
  technical_solution: z.string().min(20).max(2000),
  tech_stack: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }
    return val;
  }, z.array(z.string()).min(1, "At least one technology is required")),
  github_link: emptyToNull,
  live_demo_link: emptyToNull,
  image_url: emptyToNull,
  video_url: emptyToNull,
  status: z.enum(["in_progress", "completed"]),
});

export const updateProjectSchema = createProjectSchema.partial();

// Event schemas
export const createEventSchema = z.object({
  title: z.string().min(3).max(255),
  organization: z.string().min(3).max(255),
  year: z
    .string()
    .regex(
      /^\d{4}(\s*–\s*\d{4})?$|^(\d{4}\s*–\s*)?Present$/,
      "Invalid year format",
    ),
  role: z.enum(["participant", "mentor", "speaker"]),
  description: z.string().min(10).max(1000),
  image_url: emptyToNull,
});

export const updateEventSchema = createEventSchema.partial();

// Certification schemas
export const createCertificationSchema = z.object({
  platform: z.string().min(2).max(255),
  title: z.string().min(3).max(500),
  status: z.enum(["in_progress", "completed"]),
  credential_url: emptyToNull,
  date_earned: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().date().optional().nullable()
  ),
  image_url: emptyToNull,
});

export const updateCertificationSchema = createCertificationSchema.partial();

// Authentication schemas
export const loginSchema = z.object({
 username: z.string().min(3),
 password: z.string().min(6),
});

export const changePasswordSchema = z
 .object({
 current_password: z.string(),
 new_password: z.string().min(8, "Password must be at least 8 characters"),
 confirm_password: z.string(),
 })
 .refine((data) => data.new_password === data.confirm_password, {
 message: "Passwords don't match",
 path: ["confirm_password"],
 });

// Pagination schema
export const paginationSchema = z.object({
 page: z.coerce.number().min(1).default(1),
 limit: z.coerce.number().min(1).max(100).default(10),
 search: z.string().optional(),
 sort: z.enum(["asc", "desc"]).default("desc"),
 sortBy: z.string().optional(),
});

// Export types
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type CreateCertification = z.infer<typeof createCertificationSchema>;
export type UpdateCertification = z.infer<typeof updateCertificationSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;

import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app.js";

// Mock database pool and models so tests run 100% in-memory without a real PostgreSQL database
vi.mock("../config/database.js", () => ({
  pool: {
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
  },
  initializeDatabase: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../models/ProjectModel.js", () => ({
  ProjectModel: {
    getAll: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "AI Recommendation Engine",
        slug: "ai-recommendation-engine",
        short_desc: "A music recommendation engine using MusiCNN & ONNX.",
        core_problem: "High latency in music feature extraction.",
        technical_solution: "Optimized feature extraction with ONNX runtime.",
        tech_stack: ["Python", "ONNX", "PyTorch"],
        status: "completed",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    ]),
    getPaginated: vi.fn().mockResolvedValue({ projects: [], total: 0, page: 1, pages: 1 }),
    getById: vi.fn().mockResolvedValue(null),
    getBySlug: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("../models/ArticleModel.js", () => ({
  ArticleModel: {
    getAll: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "Building Scalable AI Systems",
        slug: "building-scalable-ai-systems",
        summary: "Best practices for deploying machine learning models to production.",
        content: "Detailed guide on ML model deployment, monitoring, and scaling.",
        published_at: "2026-01-01T00:00:00Z",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    ]),
    getBySlug: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("../models/ProfileModel.js", () => ({
  ProfileModel: {
    getAll: vi.fn().mockResolvedValue({
      username: "Seth N. AKPLOGAN",
      hero_label: "AI & Data Science Student",
      hero_bio: "Building reliable and intelligent software.",
      academic_institution: "IFRI — Université d'Abomey-Calavi",
      contact_email: "sethakplogan@gmail.com",
      contact_linkedin: "https://linkedin.com/in/seth-akplogan",
      contact_github: "https://github.com/Flex1-tech",
    }),
    get: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("../models/CertificationModel.js", () => ({
  CertificationModel: {
    getAll: vi.fn().mockResolvedValue([
      {
        id: 1,
        platform: "Google",
        title: "TensorFlow Developer Certificate",
        status: "completed",
        date_earned: "2025-06-01",
        created_at: "2025-06-01T00:00:00Z",
        updated_at: "2025-06-01T00:00:00Z",
      },
    ]),
  },
}));

vi.mock("../models/EventModel.js", () => ({
  EventModel: {
    getAll: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "IndabaX Benin 2025",
        organization: "IndabaX",
        year: "2025",
        role: "participant",
        description: "Annual deep learning workshop and symposium.",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
    ]),
  },
}));

describe("Public API Integration Tests", () => {
  it("GET /health - should return server health status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Server is running");
  });

  it("GET /sitemap.xml - should return XML content", async () => {
    const res = await request(app).get("/sitemap.xml");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/xml");
    expect(res.text).toContain("<?xml");
    expect(res.text).toContain("<urlset");
  });

  it("GET /api/projects - should return list of projects", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /llms.txt - should return text/plain LLMs summary", async () => {
    const res = await request(app).get("/llms.txt");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toContain("Seth N. AKPLOGAN");
    expect(res.text).toContain("## About");
  });

  it("GET /llms-full.txt - should return text/plain full LLMs dataset", async () => {
    const res = await request(app).get("/llms-full.txt");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toContain("Seth N. AKPLOGAN");
    expect(res.text).toContain("## PROFILE");
  });
});

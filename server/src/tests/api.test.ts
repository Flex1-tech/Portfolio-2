import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../index.js";

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

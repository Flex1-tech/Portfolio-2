/**
 * Unit tests for Zod validation schemas
 *
 * These tests are purely in-memory — no database, no network.
 * Safe to run in any CI environment.
 */

import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  createArticleSchema,
  loginSchema,
  changePasswordSchema,
  paginationSchema,
  createCertificationSchema,
  createEventSchema,
} from "../schemas/validation.js";

// ─── Project Schema ───────────────────────────────────────────────────────────

describe("createProjectSchema", () => {
  const validProject = {
    title: "AI Dashboard",
    slug: "ai-dashboard",
    short_desc: "A beautiful AI monitoring dashboard with real-time metrics.",
    core_problem: "Teams lack visibility into AI model performance in production environments.",
    technical_solution: "Built a real-time dashboard using React and WebSockets to stream model metrics.",
    tech_stack: ["React", "TypeScript", "WebSocket"],
    status: "completed" as const,
  };

  it("should accept a valid project", () => {
    const result = createProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("should reject a title shorter than 3 characters", () => {
    const result = createProjectSchema.safeParse({ ...validProject, title: "AI" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("title");
    }
  });

  it("should reject a slug with spaces or uppercase", () => {
    const result = createProjectSchema.safeParse({ ...validProject, slug: "My Project Slug" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("slug");
    }
  });

  it("should accept a valid slug with hyphens and numbers", () => {
    const result = createProjectSchema.safeParse({ ...validProject, slug: "my-project-2024" });
    expect(result.success).toBe(true);
  });

  it("should reject tech_stack as an empty array", () => {
    const result = createProjectSchema.safeParse({ ...validProject, tech_stack: [] });
    expect(result.success).toBe(false);
  });

  it("should coerce a comma-separated tech_stack string to an array", () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      tech_stack: "React,TypeScript,Node.js",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tech_stack).toEqual(["React", "TypeScript", "Node.js"]);
    }
  });

  it("should reject an invalid status value", () => {
    const result = createProjectSchema.safeParse({ ...validProject, status: "archived" });
    expect(result.success).toBe(false);
  });

  it("should convert empty string URL to null", () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      github_link: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.github_link).toBeNull();
    }
  });

  it("should reject a malformed URL for github_link", () => {
    const result = createProjectSchema.safeParse({
      ...validProject,
      github_link: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

// ─── Article Schema ───────────────────────────────────────────────────────────

describe("createArticleSchema", () => {
  const validArticle = {
    title: "Understanding Transformers",
    slug: "understanding-transformers",
    summary: "A deep dive into the Transformer architecture and its applications in NLP.",
    content:
      "The Transformer architecture, introduced by Vaswani et al. in 2017, has become the backbone of modern NLP systems including BERT, GPT, and T5. This article explores its core mechanisms including self-attention, positional encoding, and multi-head attention.",
  };

  it("should accept a valid article", () => {
    const result = createArticleSchema.safeParse(validArticle);
    expect(result.success).toBe(true);
  });

  it("should reject a content shorter than 50 characters", () => {
    const result = createArticleSchema.safeParse({ ...validArticle, content: "Too short." });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("content");
    }
  });

  it("should reject a slug with uppercase letters", () => {
    const result = createArticleSchema.safeParse({
      ...validArticle,
      slug: "UnderstandingTransformers",
    });
    expect(result.success).toBe(false);
  });

  it("should default order_index to 0 if not provided", () => {
    const result = createArticleSchema.safeParse(validArticle);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.order_index).toBe(0);
    }
  });
});

// ─── Login Schema ─────────────────────────────────────────────────────────────

describe("loginSchema", () => {
  it("should accept valid credentials", () => {
    const result = loginSchema.safeParse({ username: "admin", password: "securepass" });
    expect(result.success).toBe(true);
  });

  it("should reject a username shorter than 3 characters", () => {
    const result = loginSchema.safeParse({ username: "ad", password: "securepass" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("username");
    }
  });

  it("should reject a password shorter than 6 characters", () => {
    const result = loginSchema.safeParse({ username: "admin", password: "1234" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
    }
  });
});

// ─── Change Password Schema ───────────────────────────────────────────────────

describe("changePasswordSchema", () => {
  it("should accept matching passwords", () => {
    const result = changePasswordSchema.safeParse({
      current_password: "oldpassword",
      new_password: "NewSecure123!",
      confirm_password: "NewSecure123!",
    });
    expect(result.success).toBe(true);
  });

  it("should reject non-matching passwords", () => {
    const result = changePasswordSchema.safeParse({
      current_password: "oldpassword",
      new_password: "NewSecure123!",
      confirm_password: "DifferentPassword",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirm_password");
      expect(result.error.issues[0].message).toBe("Passwords don't match");
    }
  });

  it("should reject a new password shorter than 8 characters", () => {
    const result = changePasswordSchema.safeParse({
      current_password: "oldpassword",
      new_password: "short",
      confirm_password: "short",
    });
    expect(result.success).toBe(false);
  });
});

// ─── Pagination Schema ────────────────────────────────────────────────────────

describe("paginationSchema", () => {
  it("should apply default values when query is empty", () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
      expect(result.data.sort).toBe("desc");
    }
  });

  it("should coerce string numbers to integers", () => {
    const result = paginationSchema.safeParse({ page: "3", limit: "25" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(25);
    }
  });

  it("should reject page < 1", () => {
    const result = paginationSchema.safeParse({ page: "0" });
    expect(result.success).toBe(false);
  });

  it("should reject limit > 100", () => {
    const result = paginationSchema.safeParse({ limit: "200" });
    expect(result.success).toBe(false);
  });

  it("should reject an invalid sort value", () => {
    const result = paginationSchema.safeParse({ sort: "random" });
    expect(result.success).toBe(false);
  });
});

// ─── Certification Schema ─────────────────────────────────────────────────────

describe("createCertificationSchema", () => {
  const validCert = {
    platform: "Google",
    title: "Machine Learning Specialization",
    status: "completed" as const,
  };

  it("should accept a valid certification", () => {
    const result = createCertificationSchema.safeParse(validCert);
    expect(result.success).toBe(true);
  });

  it("should reject a platform name shorter than 2 characters", () => {
    const result = createCertificationSchema.safeParse({ ...validCert, platform: "G" });
    expect(result.success).toBe(false);
  });

  it("should reject an invalid status", () => {
    const result = createCertificationSchema.safeParse({ ...validCert, status: "expired" });
    expect(result.success).toBe(false);
  });

  it("should convert empty date_earned to null", () => {
    const result = createCertificationSchema.safeParse({ ...validCert, date_earned: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.date_earned).toBeNull();
    }
  });
});

// ─── Event Schema ─────────────────────────────────────────────────────────────

describe("createEventSchema", () => {
  const validEvent = {
    title: "AI Hackathon 2024",
    organization: "IEEE",
    year: "2024",
    role: "participant" as const,
    description: "A 48-hour hackathon focused on building AI-powered solutions for social good.",
  };

  it("should accept a valid event", () => {
    const result = createEventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it("should accept a year range format", () => {
    const result = createEventSchema.safeParse({ ...validEvent, year: "2023 – 2024" });
    expect(result.success).toBe(true);
  });

  it("should reject an invalid role", () => {
    const result = createEventSchema.safeParse({ ...validEvent, role: "attendee" });
    expect(result.success).toBe(false);
  });

  it("should reject a description shorter than 10 characters", () => {
    const result = createEventSchema.safeParse({ ...validEvent, description: "Short" });
    expect(result.success).toBe(false);
  });
});

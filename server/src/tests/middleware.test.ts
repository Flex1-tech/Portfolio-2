/**
 * Unit tests for Express middleware functions
 *
 * These tests mock the req/res objects — no database, no network.
 * Safe to run in any CI environment.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import {
  validate,
  validateQuery,
  requireAuth,
  requireAdmin,
  sanitizeInput,
  errorHandler,
} from "../middleware/index.js";
import { z } from "zod";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    query: {},
    session: {},
    method: "GET",
    path: "/test",
    ...overrides,
  } as unknown as Request;
}

function mockRes(): { res: Response; json: ReturnType<typeof vi.fn>; status: ReturnType<typeof vi.fn> } {
  const json = vi.fn().mockReturnThis();
  const status = vi.fn().mockReturnThis();
  const res = { status, json } as unknown as Response;
  // Make status().json() chainable
  (res.status as any).mockReturnValue({ json });
  return { res, json, status };
}

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

// ─── validate() middleware ────────────────────────────────────────────────────

describe("validate()", () => {
  const schema = z.object({
    name: z.string().min(3),
    age: z.number().min(0),
  });

  it("should call next() with valid data and mutate req.body", () => {
    const req = mockReq({ body: { name: "Seth", age: 24 } });
    const { res } = mockRes();
    const next = mockNext();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(); // no error argument
    expect(req.body).toEqual({ name: "Seth", age: 24 });
  });

  it("should return 400 with formatted errors on invalid data", () => {
    const req = mockReq({ body: { name: "S", age: -1 } }); // name too short, age negative
    const { res, status, json } = mockRes();
    const next = mockNext();

    validate(schema)(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Validation error",
        errors: expect.arrayContaining([
          expect.objectContaining({ field: "name" }),
        ]),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

// ─── validateQuery() middleware ───────────────────────────────────────────────

describe("validateQuery()", () => {
  const schema = z.object({
    page: z.coerce.number().min(1),
  });

  it("should call next() with valid query params", () => {
    const req = mockReq({ query: { page: "2" } as any });
    const { res } = mockRes();
    const next = mockNext();

    validateQuery(schema)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should return 400 with invalid query params", () => {
    const req = mockReq({ query: { page: "0" } as any }); // page < 1
    const { res, status } = mockRes();
    const next = mockNext();

    validateQuery(schema)(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});

// ─── requireAuth() middleware ─────────────────────────────────────────────────

describe("requireAuth()", () => {
  it("should call next() when session.userId is set", () => {
    const req = mockReq({ session: { userId: 42 } as any });
    const { res } = mockRes();
    const next = mockNext();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should return 401 when session.userId is missing", () => {
    const req = mockReq({ session: {} as any });
    const { res, status, json } = mockRes();
    const next = mockNext();

    requireAuth(req, res, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Unauthorized. Please log in." })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

// ─── requireAdmin() middleware ────────────────────────────────────────────────

describe("requireAdmin()", () => {
  it("should call next() when session.isAdmin is true", () => {
    const req = mockReq({ session: { userId: 1, isAdmin: true } as any });
    const { res } = mockRes();
    const next = mockNext();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should return 403 when session.isAdmin is false", () => {
    const req = mockReq({ session: { userId: 1, isAdmin: false } as any });
    const { res, status, json } = mockRes();
    const next = mockNext();

    requireAdmin(req, res, next);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Forbidden. Admin access required." })
    );
  });

  it("should return 403 when session.isAdmin is undefined", () => {
    const req = mockReq({ session: {} as any });
    const { res, status } = mockRes();
    const next = mockNext();

    requireAdmin(req, res, next);

    expect(status).toHaveBeenCalledWith(403);
  });
});

// ─── sanitizeInput() middleware ───────────────────────────────────────────────

describe("sanitizeInput()", () => {
  it("should remove <script> tags from body strings", () => {
    const req = mockReq({
      body: { name: "<script>alert('xss')</script>Hello" },
      query: {} as any,
    });
    const { res } = mockRes();
    const next = mockNext();

    sanitizeInput(req, res, next);

    expect(req.body.name).not.toContain("<script>");
    expect(req.body.name).toContain("Hello");
    expect(next).toHaveBeenCalledOnce();
  });

  it("should remove javascript: protocol references", () => {
    const req = mockReq({
      body: { url: "javascript:alert(1)" },
      query: {} as any,
    });
    const { res } = mockRes();
    const next = mockNext();

    sanitizeInput(req, res, next);

    expect(req.body.url).not.toContain("javascript:");
  });

  it("should sanitize nested objects recursively", () => {
    const req = mockReq({
      body: { outer: { inner: "<script>xss</script>safe" } },
      query: {} as any,
    });
    const { res } = mockRes();
    const next = mockNext();

    sanitizeInput(req, res, next);

    expect(req.body.outer.inner).not.toContain("<script>");
    expect(req.body.outer.inner).toContain("safe");
  });

  it("should pass through non-string values unchanged", () => {
    const req = mockReq({
      body: { count: 42, active: true },
      query: {} as any,
    });
    const { res } = mockRes();
    const next = mockNext();

    sanitizeInput(req, res, next);

    expect(req.body.count).toBe(42);
    expect(req.body.active).toBe(true);
  });
});

// ─── errorHandler() middleware ────────────────────────────────────────────────

describe("errorHandler()", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 500 with detailed message in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const req = mockReq();
    const { res, status, json } = mockRes();
    const next = mockNext();
    const error = new Error("Detailed error message");

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Detailed error message",
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it("should return 500 with a generic message in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const req = mockReq();
    const { res, status, json } = mockRes();
    const next = mockNext();
    const error = new Error("Sensitive internal error");

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "An error occurred",
      })
    );

    process.env.NODE_ENV = originalEnv;
  });
});

/**
 * Admin Authentication Routes
 * Login, logout, and session management
 */

import { Router, Request, Response } from "express";
import { AdminUserModel } from "../models/AdminUserModel.js";
import { loginSchema } from "../schemas/validation.js";
import { validate, requireAuth, sanitizeInput } from "../middleware/index.js";
import rateLimit from "express-rate-limit";

const router = Router();

/**
 * Rate limiter for login attempts
 */
const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "5"),
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /admin/login - Admin login
 */
router.post(
  "/login",
  sanitizeInput,
  loginLimiter,
  validate(loginSchema),
  (req: Request, res: Response): void => {
    try {
      const { username, password } = req.body;

      const user = AdminUserModel.getByUsername(username);
      if (!user || !user.password_hash) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      const isPasswordValid = AdminUserModel.verifyPassword(
        user.password_hash,
        password,
      );
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      // Update last login
      AdminUserModel.updateLastLogin(user.id!);

      // Create session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.isAdmin = true;

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  },
);

/**
 * POST /admin/logout - Admin logout
 */
router.post("/logout", (req: Request, res: Response): void => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
      return;
    }

    res.clearCookie("connect.sid");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

/**
 * GET /admin/session - Get current session
 */
router.get("/session", requireAuth, (req: Request, res: Response) => {
  const user = AdminUserModel.getById(req.session.userId!);

  res.json({
    success: true,
    user: {
      id: user?.id,
      username: user?.username,
      email: user?.email,
    },
  });
});

export default router;

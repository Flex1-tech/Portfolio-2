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
 async (req: Request, res: Response): Promise<void> => {
 try {
    const { username, password } = req.body;

 const user = await AdminUserModel.getByUsername(username);
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
 await AdminUserModel.updateLastLogin(user.id!);

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
router.get("/session", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const user = await AdminUserModel.getById(req.session.userId!);

  res.json({
    success: true,
    user: {
      id: user?.id,
      username: user?.username,
      email: user?.email,
    },
  });
});

/**
 * PUT /admin/update-password - Change password for currently logged-in admin
 */
router.put("/update-password", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: "Les deux champs sont requis" });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: "Le nouveau mot de passe doit faire au moins 8 caractères" });
      return;
    }

    const userId = req.session.userId!;
    const user = await AdminUserModel.getById(userId);

    if (!user || !user.password_hash) {
      res.status(404).json({ success: false, message: "Utilisateur introuvable" });
      return;
    }

    // Verify current password
    const isValid = AdminUserModel.verifyPassword(user.password_hash, currentPassword);
    if (!isValid) {
      res.status(401).json({ success: false, message: "Mot de passe actuel incorrect" });
      return;
    }

    // Hash & save new password
    await AdminUserModel.updatePassword(userId, newPassword);

    res.json({ success: true, message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, message: "Erreur interne du serveur" });
  }
});

export default router;
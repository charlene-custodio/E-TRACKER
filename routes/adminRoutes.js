import express from "express";
import { showAdminDashboard } from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin Dashboard route: must be logged in AND an admin
router.get("/admin_dashboard", requireAuth, requireAdmin, showAdminDashboard);

export default router;
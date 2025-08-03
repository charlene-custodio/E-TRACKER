import express from "express";
import { requireAuth, requireTutor } from "../middleware/auth.js";
import { showDashboard } from "../controllers/tutorController.js";

const router = express.Router();

// Dashboard route for tutors (uses controller for DRY logic)
router.get("/dashboard", requireAuth, requireTutor, showDashboard);

// Add more tutor-only routes here in the future

export default router;
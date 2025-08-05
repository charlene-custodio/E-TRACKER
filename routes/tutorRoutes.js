import express from "express";
import { requireAuth, requireTutor } from "../middleware/auth.js";
import { showDashboard } from "../controllers/tutorController.js";

const router = express.Router();

router.get("/dashboard", requireAuth, requireTutor, showDashboard);

export default router;
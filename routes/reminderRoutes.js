// reminderRoutes.js
import express from "express";
import { requireAuth, requireTutor } from "../middleware/auth.js";
import {
  showRemindersPage,
  listReminders,
  createReminderApi,
  updateReminderApi,
  deleteReminderApi
} from "../controllers/reminderController.js";

const router = express.Router();

// Page
router.get("/reminders", requireAuth, requireTutor, showRemindersPage);

// API (scoped to logged-in tutor)
router.get("/api/reminders", requireAuth, requireTutor, listReminders);
router.post("/api/reminders", requireAuth, requireTutor, createReminderApi);
router.put("/api/reminders/:id", requireAuth, requireTutor, updateReminderApi);
router.delete("/api/reminders/:id", requireAuth, requireTutor, deleteReminderApi);

export default router;
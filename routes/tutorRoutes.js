// tutorRoutes.js
import express from "express";
import { requireAuth, requireTutor } from "../middleware/auth.js";
import { showDashboard } from "../controllers/tutorController.js";
import upload from "../middleware/upload.js";
import { addStudentController } from "../controllers/addStudentController.js";

const router = express.Router();

// Dashboard route for tutors
router.get("/dashboard", requireAuth, requireTutor, showDashboard);

// Add Student Page (GET and POST)
router.get("/add_student", requireAuth, requireTutor, (req, res) => {
  res.render("add_student", { user: req.session });
});
router.post("/add_student", requireAuth, requireTutor, upload.single('id_picture'), addStudentController);

export default router;
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { 
  listAnecdotalReportsApi,
  listAnecdotalReportsPage,
  submitAnecdotalReport,
  updateAnecdotalReport, deleteAnecdotalReport
} from "../controllers/anecdotalReportController.js";
import {
  getAnecdotalReportsByStudent,
  getSessionsByReportId,
  getStudentById
} from "../models/anecdotalReportModel.js";

const router = express.Router();

// Page view
router.get("/students/:studentId/anecdotal-reports", requireAuth, listAnecdotalReportsPage);

// API endpoints
router.get("/api/students/:studentId/anecdotal-reports", requireAuth, listAnecdotalReportsApi);
router.post("/api/students/:studentId/anecdotal-reports", requireAuth, submitAnecdotalReport);


//edit delete


router.put("/api/students/:studentId/anecdotal-reports/:reportId", requireAuth, updateAnecdotalReport);
router.delete("/api/students/:studentId/anecdotal-reports/:reportId", requireAuth, deleteAnecdotalReport);

function formatTime12(time) {
  if (!time) return '';
  let [hour, minute] = time.split(':').map(Number);
  let ampm = hour < 12 || hour === 24 ? 'am' : 'pm';
  hour = hour % 12 || 12;
  return `${hour}:${minute.toString().padStart(2, '0')}${ampm}`;
}

router.get("/students/:studentId/anecdotal-download", async (req, res) => {
  const studentId = Number(req.params.studentId);
  if (!studentId) return res.status(400).send("Invalid student id.");

  const student = await getStudentById(studentId);
  const reports = await getAnecdotalReportsByStudent(studentId);

  for (const report of reports) {
    report.sessions = await getSessionsByReportId(report.id);
    report.student_name = student?.name || "";
    report.grade_level = student?.grade_level || "";
    report.school_name = student?.school_name || "";
  }

  res.render("anecdotal-download", { reports, formatTime12 });
});


export default router;
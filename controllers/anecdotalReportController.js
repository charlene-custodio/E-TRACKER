import pool from "../config/db.js";
import {
  getAnecdotalReportsByStudent,
  createAnecdotalReport,
  addAnecdotalSessions,
  getSessionsByReportId,
  getStudentById,
  updateReportInDb,
  replaceAnecdotalSessions,
  deleteReportInDb
} from "../models/anecdotalReportModel.js";

// Calculate total hours from sessions
export function calcTotalHours(sessions) {
  let totalHours = 0;
  for (const session of sessions) {
    if (!session.time_in || !session.time_out) continue;
    const [inH, inM] = session.time_in.split(':').map(Number);
    const [outH, outM] = session.time_out.split(':').map(Number);
    const start = inH * 60 + inM;
    const end = outH * 60 + outM;
    let diff = end - start;
    if (diff < 0) diff += 24 * 60; // overnight
    totalHours += diff / 60;
  }
  return totalHours.toFixed(2);
}

// API: List all reports for a student (JSON)
export async function listAnecdotalReportsApi(req, res) {
  const studentId = Number(req.params.studentId);
  if (!studentId) return res.status(400).json({ error: "Invalid student id." });

  const student = await getStudentById(studentId);
  const reports = await getAnecdotalReportsByStudent(studentId);

  for (const report of reports) {
    report.sessions = await getSessionsByReportId(report.id);
    report.student_name = student?.name || "";
    report.grade_level = student?.grade_level || "";
    report.school_name = student?.school_name || "";
  }
  res.json(reports);
}

// Page: List all reports for a student (EJS render)
export async function listAnecdotalReportsPage(req, res) {
  const studentId = Number(req.params.studentId);
  if (!studentId) return res.status(400).render("error", { error: "Invalid student id." });

  const student = await getStudentById(studentId);
  const reports = await getAnecdotalReportsByStudent(studentId);

  for (const report of reports) {
    report.sessions = await getSessionsByReportId(report.id);
    report.student_name = student?.name || "";
    report.grade_level = student?.grade_level || "";
    report.school_name = student?.school_name || "";
  }
  res.render("anecdotalReports", { reports });
}

// Create new report
export async function submitAnecdotalReport(req, res) {
  const student_id = Number(req.params.studentId);
  const created_by = req.session.userId;
  const {
    report_date,
    learner_difficulties,
    intervention,
    result,
    sessions // array
  } = req.body;

  if (!student_id || !report_date || !learner_difficulties || !intervention || !result) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const totalHours = calcTotalHours(sessions);

  const report = await createAnecdotalReport({
    report_date,
    hours: totalHours,
    student_id,
    learner_difficulties,
    intervention,
    result,
    created_by
  });

  await addAnecdotalSessions(report.id, sessions);

  res.status(201).json(report);
}

// Update report and sessions
export async function updateAnecdotalReport(req, res) {
  const { reportId } = req.params;
  const updates = req.body;

  // Update main fields
  await updateReportInDb(reportId, updates);

  // Replace sessions
  await replaceAnecdotalSessions(reportId, updates.sessions);

  // Recalculate hours and update
  const hours = calcTotalHours(updates.sessions);
  await pool.query(
    `UPDATE anecdotal_reports SET hours = $1 WHERE id = $2`,
    [hours, reportId]
  );

  res.json({ success: true });
}

// Delete report and sessions
export async function deleteAnecdotalReport(req, res) {
  const { reportId } = req.params;
  await deleteReportInDb(reportId);
  res.json({ success: true });
}
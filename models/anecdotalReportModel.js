import pool from "../config/db.js";

// Get all anecdotal reports for a student
export async function getAnecdotalReportsByStudent(studentId) {
  const { rows } = await pool.query(
    `SELECT ar.*, u.full_name AS created_by_name
     FROM anecdotal_reports ar
     LEFT JOIN users u ON ar.created_by = u.id
     WHERE ar.student_id = $1
     ORDER BY ar.report_date DESC, ar.created_at DESC`,
    [studentId]
  );
  return rows;
}

// Create a new anecdotal report
export async function createAnecdotalReport({
  report_date,
  hours,
  student_id,
  learner_difficulties,
  intervention,
  result,
  created_by
}) {
  const { rows } = await pool.query(
    `INSERT INTO anecdotal_reports
      (report_date, hours, student_id, learner_difficulties, intervention, result, actions, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [report_date, hours, student_id, learner_difficulties, intervention, result, "", created_by]
  );
  return rows[0];
}

export async function addAnecdotalSessions(report_id, sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return;
  for (const session of sessions) {
    await pool.query(
      `INSERT INTO anecdotal_sessions (anecdotal_report_id, time_in, time_out)
       VALUES ($1, $2, $3)`,
      [report_id, session.time_in, session.time_out]
    );
  }
}

export async function getSessionsByReportId(reportId) {
  const { rows } = await pool.query(
    `SELECT * FROM anecdotal_sessions WHERE anecdotal_report_id = $1 ORDER BY time_in ASC`,
    [reportId]
  );
  return rows;
}

export async function getStudentById(studentId) {
  const { rows } = await pool.query(
    `SELECT name, grade_level, school_name FROM students WHERE id = $1`,
    [studentId]
  );
  return rows[0] || null;
}

// Update anecdotal report main fields
export async function updateReportInDb(reportId, updates) {
  const { learner_difficulties, intervention, result } = updates;
  await pool.query(
    `UPDATE anecdotal_reports SET
      learner_difficulties = $1,
      intervention = $2,
      result = $3
     WHERE id = $4`,
    [learner_difficulties, intervention, result, reportId]
  );
}

// Replace sessions for a report
export async function replaceAnecdotalSessions(reportId, sessions) {
  await pool.query(
    `DELETE FROM anecdotal_sessions WHERE anecdotal_report_id = $1`,
    [reportId]
  );
  if (Array.isArray(sessions) && sessions.length > 0) {
    for (const session of sessions) {
      await pool.query(
        `INSERT INTO anecdotal_sessions (anecdotal_report_id, time_in, time_out)
         VALUES ($1, $2, $3)`,
        [reportId, session.time_in, session.time_out]
      );
    }
  }
}

// Delete report and its sessions
export async function deleteReportInDb(reportId) {
  await pool.query(
    `DELETE FROM anecdotal_sessions WHERE anecdotal_report_id = $1`,
    [reportId]
  );
  await pool.query(
    `DELETE FROM anecdotal_reports WHERE id = $1`,
    [reportId]
  );
}
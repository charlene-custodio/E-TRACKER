import pool from "../config/db.js";

// Get all students, selecting only needed fields
export async function getAllStudents() {
  const result = await pool.query(
    `SELECT id, id_picture, name, grade_level,sex
     FROM students 
     ORDER BY created_at DESC`
  );
  return result.rows;
}
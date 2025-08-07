
//studentModel.js

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


// DRY principle: one function for adding a student
export async function addStudent(studentData) {
  const {
    id_picture, name, grade_level, school_name, birthday, age, sex, address,
    guardian, contact, school_year, lrn, section, enrollment_status,
    adviser, learning_difficulty, created_by
  } = studentData;

  const result = await pool.query(
    `INSERT INTO students (
      id_picture, name, grade_level, school_name, birthday, age, sex, address,
      guardian, contact, school_year, lrn, section, enrollment_status,
      adviser, learning_difficulty, created_by, created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()
    ) RETURNING *`,
    [
      id_picture, name, grade_level, school_name, birthday, age, sex, address,
      guardian, contact, school_year, lrn, section, enrollment_status,
      adviser, learning_difficulty, created_by
    ]
  );
  return result.rows[0];
}


export async function getStudentById(id) {
  const result = await pool.query(
    `SELECT * FROM students WHERE id = $1`, [id]
  );
  return result.rows[0];
}

export async function updateStudentById(id, data) {
  // Whitelist updatable fields for security/DRY
  const fields = [
    "name", "grade_level", "school_name", "birthday", "age", "sex", "address",
    "guardian", "contact", "school_year", "lrn", "section", "enrollment_status",
    "adviser", "learning_difficulty"
  ];
  const updates = [];
  const values = [];
  let idx = 1;
  for (const field of fields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = $${idx++}`);
      values.push(data[field]);
    }
  }
  if (!updates.length) throw new Error("No fields to update");
  values.push(id);

  const result = await pool.query(
    `UPDATE students SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function getStudentsByTutor(tutorId) {
  const result = await pool.query(
    `SELECT id, id_picture, name, grade_level, sex
     FROM students
     WHERE created_by = $1
     ORDER BY created_at DESC`,
    [tutorId]
  );
  return result.rows;
}
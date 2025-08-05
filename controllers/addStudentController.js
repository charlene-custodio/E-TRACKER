import pool from "../config/db.js";

export async function addStudentController(req, res) {
  try {
    const {
      name, grade_level, school_name, birthday, age, sex, address,
      guardian, contact, school_year, lrn, section, enrollment_status,
      adviser, learning_difficulty
    } = req.body;

    // File upload handling
    const id_picture = req.file ? req.file.filename : null;

    await pool.query(
      `INSERT INTO students (
        id_picture, name, grade_level, school_name, birthday, age, sex, address,
        guardian, contact, school_year, lrn, section, enrollment_status,
        adviser, learning_difficulty, created_by, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()
      )`,
      [
        id_picture, name, grade_level, school_name, birthday, age, sex, address,
        guardian, contact, school_year, lrn, section, enrollment_status,
        adviser, learning_difficulty, req.session.userId
      ]
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("add_student", { error: "Failed to add student.", user: req.session });
  }
}
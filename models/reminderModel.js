import pool from "../config/db.js";

// Get all reminders for a tutor
export async function getRemindersByTutor(tutorId) {
  const { rows } = await pool.query(
    `SELECT id, title, description, remind_at, created_at, is_done
     FROM reminders
     WHERE tutor_id = $1
     ORDER BY remind_at NULLS LAST, created_at DESC`,
    [tutorId]
  );
  return rows;
}

// Create a new reminder
export async function createReminder({ title, description, remind_at, tutor_id }) {
  const { rows } = await pool.query(
    `INSERT INTO reminders (title, description, remind_at, tutor_id, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, title, description, remind_at, created_at, is_done`,
    [title, description ?? null, remind_at ?? null, tutor_id]
  );
  return rows[0];
}

// Update an existing reminder (supports marking as done)
export async function updateReminder(id, tutor_id, data) {
  const allowedFields = ["title", "description", "remind_at", "is_done"];
  const updates = [];
  const values = [];
  let idx = 1;
  for (const field of allowedFields) {
    if (typeof data[field] !== "undefined") {
      updates.push(`${field} = $${idx++}`);
      values.push(data[field]);
    }
  }
  if (!updates.length) throw new Error("No fields to update");
  values.push(id, tutor_id);
  const { rows } = await pool.query(
    `UPDATE reminders
     SET ${updates.join(", ")}
     WHERE id = $${values.length - 1} AND tutor_id = $${values.length}
     RETURNING id, title, description, remind_at, created_at, is_done`,
    values
  );
  return rows[0];
}

// Delete a reminder
export async function deleteReminder(id, tutorId) {
  const { rows } = await pool.query(
    `DELETE FROM reminders
     WHERE id = $1 AND tutor_id = $2
     RETURNING id`,
    [id, tutorId]
  );
  return rows[0];
}
// reminderModel.js
import pool from "../config/db.js";

export async function getRemindersByTutor(tutorId) {
  const { rows } = await pool.query(
    `SELECT id, title, description, remind_at, created_at
     FROM reminders
     WHERE tutor_id = $1
     ORDER BY remind_at NULLS LAST, created_at DESC`,
    [tutorId]
  );
  return rows;
}

export async function createReminder({ title, description, remind_at, tutor_id }) {
  const { rows } = await pool.query(
    `INSERT INTO reminders (title, description, remind_at, tutor_id, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, title, description, remind_at, created_at`,
    [title, description ?? null, remind_at ?? null, tutor_id]
  );
  return rows[0];
}

export async function updateReminder(id, tutorId, data) {
  const fields = ["title", "description", "remind_at"];
  const sets = [];
  const values = [];
  let i = 1;

  for (const f of fields) {
    if (data[f] !== undefined) {
      sets.push(`${f} = $${i++}`);
      values.push(data[f]);
    }
  }
  if (!sets.length) {
    const { rows } = await pool.query(
      `SELECT id, title, description, remind_at, created_at
       FROM reminders WHERE id = $1 AND tutor_id = $2`,
      [id, tutorId]
    );
    return rows[0];
  }

  values.push(id, tutorId);
  const { rows } = await pool.query(
    `UPDATE reminders
     SET ${sets.join(", ")}
     WHERE id = $${values.length - 1} AND tutor_id = $${values.length}
     RETURNING id, title, description, remind_at, created_at`,
    values
  );
  return rows[0];
}

export async function deleteReminder(id, tutorId) {
  const { rows } = await pool.query(
    `DELETE FROM reminders
     WHERE id = $1 AND tutor_id = $2
     RETURNING id`,
    [id, tutorId]
  );
  return rows[0];
}
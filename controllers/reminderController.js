// reminderController.js
import {
  getRemindersByTutor,
  createReminder,
  updateReminder,
  deleteReminder
} from "../models/reminderModel.js";

function toDateOrNull(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

// Page render
export async function showRemindersPage(req, res) {
  const reminders = await getRemindersByTutor(req.session.userId);
  res.render("reminders", {
    user: {
      username: req.session.username,
      full_name: req.session.full_name,
      role: req.session.role
    },
    reminders // <-- must be array of reminders from DB
  });
}

// API
export async function listReminders(req, res) {
  const reminders = await getRemindersByTutor(req.session.userId);
  res.json(reminders);
}

export async function createReminderApi(req, res) {
  const { title, description, remind_at } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required." });

  const created = await createReminder({
    title,
    description,
    remind_at: toDateOrNull(remind_at),
    tutor_id: req.session.userId
  });
  res.status(201).json(created);
}

export async function updateReminderApi(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id." });

  // Only add fields that are present in the request
  const payload = {};
  ["title", "description", "remind_at", "is_done"].forEach((field) => {
    if (typeof req.body[field] !== "undefined") payload[field] = req.body[field];
  });

  try {
    const updated = await updateReminder(id, req.session.userId, payload);
    if (!updated) return res.status(404).json({ error: "Not found." });
    res.json(updated);
  } catch (err) {
    // Log the error for debugging
    console.error("Update Reminder Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function deleteReminderApi(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id." });

  const deleted = await deleteReminder(id, req.session.userId);
  if (!deleted) return res.status(404).json({ error: "Not found." });
  res.json({ ok: true, id });
}
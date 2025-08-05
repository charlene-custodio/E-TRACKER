import { getAllStudents } from "../models/studentModel.js";

export async function showDashboard(req, res) {
  try {
    const students = await getAllStudents();
    res.render("dashboard", {
      user: {
        username: req.session.username,
        full_name: req.session.full_name,
        role: req.session.role
      },
      students // Pass students array to dashboard
    });
  } catch (err) {
    console.error(err);
    res.render("dashboard", {
      user: {
        username: req.session.username,
        full_name: req.session.full_name,
        role: req.session.role
      },
      students: [],
      error: "Failed to load students. Please try again."
    });
  }
}
import { getStudentsByTutor } from "../models/studentModel.js";

export async function showDashboard(req, res) {
  // Use session userId to get only this tutor's students
  const students = await getStudentsByTutor(req.session.userId);

  res.render("dashboard", {
    user: {
      username: req.session.username,
      full_name: req.session.full_name,
      role: req.session.role
    },
    students
  });
}
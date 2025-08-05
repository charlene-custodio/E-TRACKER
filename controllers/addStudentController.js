
import { addStudent } from "../models/studentModel.js";

export async function addStudentController(req, res) {
  try {
    const studentData = {
      ...req.body,
      id_picture: req.file ? req.file.filename : null,
      created_by: req.session.userId
    };
    await addStudent(studentData);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("add_student", { error: "Failed to add student.", user: req.session });
  }
}
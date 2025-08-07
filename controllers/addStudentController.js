import { addStudent } from "../models/studentModel.js";

export async function addStudentController(req, res) {
  const studentData = {
    ...req.body,
    id_picture: req.file ? req.file.filename : null,
    created_by: req.session.userId // ensure this line is present
  };
  await addStudent(studentData);
  res.redirect("/dashboard");
}
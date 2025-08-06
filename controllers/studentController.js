import { getStudentById } from "../models/studentModel.js";

export async function viewStudent(req, res) {
  const { id } = req.params;
  try {
    const student = await getStudentById(id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
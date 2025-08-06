
// import { getStudentById } from "../models/studentModel.js";

// export async function viewStudent(req, res) {
//   const { id } = req.params;
//   try {
//     const student = await getStudentById(id);
//     if (!student) return res.status(404).json({ error: "Student not found" });
//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// }


import { getStudentById, updateStudentById } from "../models/studentModel.js";

export async function viewStudent(req, res) {
  const student = await getStudentById(req.params.id);
  if (!student) return res.status(404).json({ error: "Not found" });
  res.json(student);
}

export async function updateStudent(req, res) {
  try {
    const updated = await updateStudentById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
}
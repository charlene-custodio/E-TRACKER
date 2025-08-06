import express from "express";
import { viewStudent, updateStudent } from "../controllers/studentController.js";
const router = express.Router();

router.get("/student/:id", viewStudent);
router.put("/student/:id", updateStudent); // <-- Add this

export default router;
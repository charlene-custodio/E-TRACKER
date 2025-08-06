
import express from "express";
import { viewStudent } from "../controllers/studentController.js";
const router = express.Router();
router.get("/student/:id", viewStudent);
export default router;
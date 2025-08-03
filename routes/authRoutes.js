import express from "express";
import {
  showRegister,
  handleRegister,
  showLogin,
  handleLogin,
  handleLogout
} from "../controllers/authController.js";

const router = express.Router();

router.get("/register", showRegister);
router.post("/register", handleRegister);

router.get("/login", showLogin);
router.post("/login", handleLogin);

router.get("/logout", handleLogout);

export default router;
import bcrypt from "bcrypt";
import pool from "../config/db.js";

const ALLOWED_ROLES = ["admin", "tutor"];
const IS_APPROVED = process.env.NODE_ENV === "production" ? false : true;

export async function showRegister(req, res) {
  res.render("auth/register", { error: null });
}

export async function handleRegister(req, res) {
  const { username, password, full_name, role } = req.body;

  if (!ALLOWED_ROLES.includes(role)) {
    return res.render("auth/register", { error: "Invalid role selected." });
  }

  try {
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rows.length > 0) {
      return res.render("auth/register", { error: "Username already exists." });
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, password_hash, full_name, role, is_approved, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [username, hash, full_name, role, IS_APPROVED]
    );
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.render("auth/register", { error: "Server error. Please try again." });
  }
}

export async function showLogin(req, res) {
  res.render("auth/login", { error: null });
}

export async function handleLogin(req, res) {
  const { username, password } = req.body;
  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.render("auth/login", { error: "Invalid username or password." });
    }
    const user = userResult.rows[0];
    if (!user.is_approved) {
      return res.render("auth/login", { error: "Account is pending approval." });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render("auth/login", { error: "Invalid username or password." });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.full_name = user.full_name;
    req.session.role = user.role;

    if (user.role === "admin") {
      res.redirect("/admin_dashboard");
    } else if (user.role === "tutor") {
      res.redirect("/dashboard");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    res.render("auth/login", { error: "Server error. Please try again." });
  }
}

export function handleLogout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}
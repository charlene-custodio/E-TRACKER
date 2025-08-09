import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import logger from "./middleware/logger.js";
import sessionMiddleware from "./middleware/session.js";
import authRoutes from "./routes/authRoutes.js";
import testDbRoutes from './routes/testDb.js';
import adminRoutes from "./routes/adminRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(sessionMiddleware);

// For testing purposes API Connection
app.use('/api', testDbRoutes);

//routes
app.use("/", authRoutes);
app.use("/", adminRoutes);
app.use("/", tutorRoutes);

import studentRoutes from "./routes/studentRoutes.js";
app.use("/", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ...existing imports
import reminderRoutes from "./routes/reminderRoutes.js";

//
app.use("/", reminderRoutes); // <-- add this
app.use("/", studentRoutes);
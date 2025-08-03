import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./middleware/logger.js"; // keep this if logger.js exists

const app = express();
const PORT = 3000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(logger);

//routes or url
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "auth", "register.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
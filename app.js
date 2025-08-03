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


//---------------------task nimo bub------//
//BUBY:
//if add ka new page copy lng and e modify ang filename and url giandaman na tika daan urls ang pag-apply nlng sa code.
//purpose anang code sa ubos is iya e render html pages naa sa public folder

// app.get("/url_name", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "file_name.html")); 
// });  

//------------URL-------------//

// : /add-student 
// : /view-student
// : /edit-student
// : /reminders
// : /archives

//-------------------------//


//sample search saimo browser localhost:3000/add-student iya e hatag saimo ang add-student na page tungod ini nga code.
app.get("/add-student", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add-student.html")); 
});       


//kaya mo yn <3
//---------------------------------------------//   




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
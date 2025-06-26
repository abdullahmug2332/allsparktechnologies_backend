// index.js
import express from 'express';
import db from './db.js';
import cors from 'cors';
import homePage from "./Routes/homePageRoutes.js";
import aboutPage from "./Routes/aboutPageRoutes.js";
import servicePage from "./Routes/servicePageRoutes.js";
import contactPage from "./Routes/contactPageRoutes.js";
import auth from "./Routes/authRoutes.js";
import blogPageRoutes from "./Routes/blogPageRoutes.js";

const app = express();

app.use("/images", express.static("images"));

const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", homePage);
app.use("/", aboutPage);
app.use("/", servicePage);
app.use("/", contactPage);
app.use("/", blogPageRoutes);
app.use("/", auth);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

import dotenv from "dotenv";
dotenv.config();
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
import blogRoutes from "./Routes/blogRoutes.js";
import contactRoutes from "./Routes/contactFormRoute.js";
const app = express();



app.use("/images", express.static("images"));
const PORT = 5000 ;

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
app.use("/", blogRoutes);
app.use("/", contactRoutes); // ✅ Already present in your code

// app.post('/api/contact', async (req, res) => {
//   const { name, email, phone, service, message } = req.body;

//   if (!name || !email || !message) {
//     return res
//       .status(400)
//       .json({ error: 'Name, email and message are required.' });
//   }

//   try {
//     // Insert into MySQL
//     const sql = `
//       INSERT INTO contacts
//         (name, email, phone, service, message)
//       VALUES
//         (?, ?, ?, ?, ?)
//     `;
//     const [result] = await db.execute(sql, [
//       name,
//       email,
//       phone,
//       service,
//       message
//     ]);

//     console.log('Inserted contact ID:', result.insertId);

//     return res.json({
//       success: true,
//       message: 'Thanks! Your request has been received.',
//       contactId: result.insertId
//     });
//   } catch (err) {
//     console.error('DB error:', err);
//     return res.status(500).json({ error: 'Database error.' });
//   }
// });
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

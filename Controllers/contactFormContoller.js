// controllers/contactController.js
import db from "../db.js";

export const submitContactForm = (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email and message are required." });
  }

  const sql = `
    INSERT INTO contacts
      (name, email, phone, service, message)
    VALUES
      (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, service, message], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    console.log("Inserted contact ID:", result.insertId);

    return res.status(200).json({
      success: true,
      message: "Thanks! Your request has been received.",
      contactId: result.insertId,
    });
  });
};

// ✅ Get all contact form data
export const getAllContacts = (req, res) => {
  const sql = "SELECT * FROM contacts ORDER BY id DESC"; 

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  });
};

// ✅ Get a single contact by ID
export const getContactById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM contacts WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Contact not found." });
    }

    return res.status(200).json(results[0]);
  });
};
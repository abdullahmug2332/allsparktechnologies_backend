// controllers/pageController.js
import db from "../db.js";

export const contactData = (req, res) => {
  const query = "SELECT json FROM contactpage WHERE id = 1";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const data = results[0];
    const parsedJson = JSON.parse(data.json); 
    res.json(parsedJson); 
  });
};

export const updateContactData = (req, res) => {
  const newJsonData = req.body;

  if (!newJsonData || typeof newJsonData !== "object") {
    return res.status(400).json({ error: "Invalid or missing JSON data" });
  }

  const stringifiedJson = JSON.stringify(newJsonData);

  const updateQuery = "UPDATE contactpage SET json = ? WHERE id = 1";

  db.query(updateQuery, [stringifiedJson], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ message: "Contact data updated successfully" });
  });
};

export const uploadContactImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }
  
  const imagePath = `${req.file.filename}`; 

  // Get existing JSON first
  const selectQuery = "SELECT json FROM contactpage WHERE id = 1";
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error reading JSON:", err);
      return res.status(500).json({ error: "Error reading existing data" });
    }

    if (!results.length) return res.status(404).json({ error: "Data not found" });

    const jsonData = JSON.parse(results[0].json);
    jsonData.heroimg = imagePath; // <-- update the image path

    const updatedJson = JSON.stringify(jsonData);
    const updateQuery = "UPDATE contactpage SET json = ? WHERE id = 1";

    db.query(updateQuery, [updatedJson], (err) => {
      if (err) {
        console.error("Error updating JSON:", err);
        return res.status(500).json({ error: "Failed to update data" });
      }
      res.json({ message: "Hero image updated", path: imagePath });
    });
  });
};

// controllers/pageController.js
import db from "../db.js";

export const aboutData = (req, res) => {
  const query = "SELECT json FROM aboutpage WHERE id = 1";

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

export const updateAboutData = (req, res) => {
  const newJsonData = req.body;

  if (!newJsonData || typeof newJsonData !== "object") {
    return res.status(400).json({ error: "Invalid or missing JSON data" });
  }

  const stringifiedJson = JSON.stringify(newJsonData);

  const updateQuery = "UPDATE aboutpage SET json = ? WHERE id = 1";

  db.query(updateQuery, [stringifiedJson], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ message: "About data updated successfully" });
  });
};


export const uploadAboutImage = (req, res) => {
  const imageKey = req.body.imageKey; // like 'img1', 'img2', 'heroimg'

  if (!req.file || !imageKey) {
    return res.status(400).json({ error: "Missing image or image key" });
  }

  const imagePath = `${req.file.filename}`;
 
  // 1. Get existing JSON
  const selectQuery = "SELECT json FROM aboutpage WHERE id = 1";
  db.query(selectQuery, (err, results) => {
    if (err) return res.status(500).json({ error: "Database read error" });

    if (!results.length) return res.status(404).json({ error: "Data not found" });

    const jsonData = JSON.parse(results[0].json);

    // 2. Update image key in JSON
    jsonData[imageKey] = imagePath;

    // 3. Update JSON in DB
    const updatedJson = JSON.stringify(jsonData);
    const updateQuery = "UPDATE aboutpage SET json = ? WHERE id = 1";

    db.query(updateQuery, [updatedJson], (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });

      res.json({ message: `${imageKey} updated successfully`, path: imagePath });
    });
  });
};

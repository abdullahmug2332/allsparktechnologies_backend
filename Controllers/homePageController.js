// controllers/pageController.js
import db from "../db.js";

export const homeData = (req, res) => {
  const query = "SELECT json FROM homepage WHERE id = 1";

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
export const updateHomeData = (req, res) => {
  const newJsonData = req.body;

  if (!newJsonData || typeof newJsonData !== "object") {
    return res.status(400).json({ error: "Invalid or missing JSON data" });
  }

  const stringifiedJson = JSON.stringify(newJsonData);

  const updateQuery = "UPDATE homepage SET json = ? WHERE id = 1";

  db.query(updateQuery, [stringifiedJson], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ message: "Home data updated successfully" });
  });
};
export const uploadHomeImage = (req, res) => {
  const imageKey = req.body.imageKey; // like 'homehero.img' or 'features[0].image'

  if (!req.file || !imageKey) {
    return res.status(400).json({ error: "Missing image or image key" });
  }

  const imagePath = `${req.file.filename}`;

  const selectQuery = "SELECT json FROM homepage WHERE id = 1";
  db.query(selectQuery, (err, results) => {
    if (err) return res.status(500).json({ error: "Database read error" });

    if (!results.length) return res.status(404).json({ error: "Data not found" });

    const jsonData = JSON.parse(results[0].json);

    // Deep update helper
    const updateNestedValue = (obj, path, value) => {
      const keys = path.replace(/\[(\d+)]/g, '.$1').split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) return false;
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return true;
    };

    const updated = updateNestedValue(jsonData, imageKey, imagePath);
    if (!updated) return res.status(400).json({ error: "Invalid imageKey path" });

    const updatedJson = JSON.stringify(jsonData);
    const updateQuery = "UPDATE homepage SET json = ? WHERE id = 1";

    db.query(updateQuery, [updatedJson], (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });

      res.json({ message: `${imageKey} updated successfully`, path: imagePath });
    });
  });
};

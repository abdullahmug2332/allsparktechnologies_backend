// controllers/blogPageController.js
import db from "../db.js";

// GET blog data
export const getBlogData = (req, res) => {
  const query = "SELECT json FROM blogpage WHERE id = 1";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching blog data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No blog data found" });
    }

    const jsonData = JSON.parse(results[0].json);
    res.json(jsonData);
  });
};

// UPDATE blog data
export const updateBlogData = (req, res) => {
  const newJsonData = req.body;

  if (!newJsonData || typeof newJsonData !== "object") {
    return res.status(400).json({ error: "Invalid or missing JSON data" });
  }

  const stringifiedJson = JSON.stringify(newJsonData);
  const updateQuery = "UPDATE blogpage SET json = ? WHERE id = 1";

  db.query(updateQuery, [stringifiedJson], (err) => {
    if (err) {
      console.error("Error updating blog data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ message: "Blog data updated successfully" });
  });
};
export const uploadBlogImage = (req, res) => {
  const imageKey = req.body.imageKey; // e.g. 'heroimg' or 'blogs[2].image'

  if (!req.file || !imageKey) {
    return res.status(400).json({ error: "Missing image or image key" });
  }
 
  const imagePath = `${req.file.filename}`;

  const selectQuery = "SELECT json FROM blogpage WHERE id = 1";
  db.query(selectQuery, (err, results) => {
    if (err) return res.status(500).json({ error: "Database read error" });

    if (!results.length) return res.status(404).json({ error: "Data not found" });

    const jsonData = JSON.parse(results[0].json);

    // 🛠️ Parse and update deep key like 'blogs[2].image'
    try {
      const keys = imageKey.replace(/\[(\w+)\]/g, ".$1").split(".");
      let ref = jsonData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!ref[keys[i]]) return res.status(400).json({ error: `Invalid path: ${imageKey}` });
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = imagePath;
    } catch (err) {
      return res.status(400).json({ error: "Invalid image key path format" });
    }

    // Save updated JSON
    const updatedJson = JSON.stringify(jsonData);
    const updateQuery = "UPDATE blogpage SET json = ? WHERE id = 1";

    db.query(updateQuery, [updatedJson], (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });

      res.json({ message: `${imageKey} updated successfully`, path: imagePath });
    });
  });
};

// Controllers/servicePageController.js
import db from "../db.js";

export const postServicePageByName = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required in body" });
  }

  db.query("SELECT * FROM servicespages WHERE name = ? LIMIT 1", [name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Service page not found" });
    }

    try {
      const json = JSON.parse(results[0].json);
      res.send(json);
    } catch (parseErr) {
      return res.status(500).json({ error: "JSON parsing failed" });
    }
  });
};


export const putServicePageByName = async (req, res) => {
  const { name, json } = req.body;

  if (!name || !json) {
    return res.status(400).json({ error: "Both 'name' and 'json' are required in body" });
  }

  const stringifiedJson = JSON.stringify(json);

  const query = "UPDATE servicespages SET json = ? WHERE name = ?";

  db.query(query, [stringifiedJson, name], (err, results) => {
    if (err) {
      console.error("Error updating service page:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Service page not found" });
    }

    res.status(200).json({ message: "Service page updated successfully" });
  });
};

export const uploadServiceImage = (req, res) => {
  const imageKey = req.body.imageKey;
  const name = req.body.name;

  if (!req.file || !imageKey || !name) {
    return res.status(400).json({ error: "Missing image, image key, or name" });
  }

  const imagePath = `${req.file.filename}`;
  const selectQuery = "SELECT json FROM servicespages WHERE name = ? LIMIT 1";

  db.query(selectQuery, [name], (err, results) => {
    if (err) return res.status(500).json({ error: "Database read error" });
    if (!results.length) return res.status(404).json({ error: "Service page not found" });

    let jsonData;
    try {
      jsonData = JSON.parse(results[0].json);
    } catch (err) {
      return res.status(500).json({ error: "JSON parsing failed" });
    }

    try {
      const keys = imageKey.replace(/\[(\w+)\]/g, '.$1').split('.');
      let ref = jsonData;
      // for (let i = 0; i < keys.length - 1; i++) {
      //   if (!ref[keys[i]]) return res.status(400).json({ error: `Invalid path: ${imageKey}` });
      //   ref = ref[keys[i]];
      // }
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (ref[key] === undefined) {
          // If next key is a number, make an array
          if (!isNaN(keys[i + 1])) {
            ref[key] = [];
          } else {
            ref[key] = {};
          }
        }
        ref = ref[key];
      }
      ref[keys[keys.length - 1]] = imagePath;
    } catch (err) {
      return res.status(400).json({ error: "Invalid image key path" });
    }

    const updatedJson = JSON.stringify(jsonData);
    const updateQuery = "UPDATE servicespages SET json = ? WHERE name = ?";

    db.query(updateQuery, [updatedJson, name], (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });

      res.json({ message: `${imageKey} updated successfully`, path: imagePath });
    });
  });
};

// controllers/subservicesController.js
import db from "../db.js";

// Get all subservices for a specific service
export const getSubservicesByService = (req, res) => {
  const { service } = req.body;

  if (!service) {
    return res.status(400).json({ error: "Service is required" });
  }

  const query = "SELECT * FROM subservices WHERE service = ?";

  db.query(query, [service], (err, results) => {
    if (err) {
      console.error("Error fetching subservices:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Parse the `json` column for each row
    const parsedResults = results.map(row => {
      try {
        return {
          ...row,
          json: row.json ? JSON.parse(row.json) : null
        };
      } catch (e) {
        console.error("Error parsing JSON for row:", row.id, e);
        return {
          ...row,
          json: null
        };
      }
    });

    res.json(parsedResults);
  });
};

// Get a single subservice by slug
export const getSubserviceBySlug = (req, res) => {
  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  const query = "SELECT * FROM subservices WHERE slug = ? LIMIT 1";

  db.query(query, [slug], (err, results) => {
    if (err) {
      console.error("Error fetching subservice:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Subservice not found" });
    }

    let subservice = results[0];

    try {
      subservice.json = subservice.json ? JSON.parse(subservice.json) : null;
    } catch (e) {
      console.error("Error parsing JSON for subservice:", subservice.id, e);
      subservice.json = null;
    }

    res.json(subservice);
  });
};


// Update a subservice
export const updateSubservice = (req, res) => {
  const { id, slug, service, json } = req.body;

  if (!id || !slug || !service || json === undefined) {
    return res.status(400).json({
      error: "id, slug, service, and json are required",
    });
  }

  const stringifiedJson = JSON.stringify(json);
  const updateQuery =
    "UPDATE subservices SET slug = ?, service = ?, json = ? WHERE id = ?";

  db.query(updateQuery, [slug, service, stringifiedJson, id], (err, result) => {
    if (err) {
      console.error("Error updating subservice:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subservice not found" });
    }

    res.json({ message: "Subservice updated successfully" });
  });
};

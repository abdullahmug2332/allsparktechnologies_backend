import db from "../db.js";

// CREATE BLOG
export const createBlog = (req, res) => {
  const { title, description, urlName, metaTitle, metaDescription, faqs, items } = req.body;
  let imagePath = null;

  if (req.file) imagePath = `${req.file.filename}`;

  const formatSlug = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const formattedUrlName = formatSlug(urlName);

  // ✅ Parse FAQs string if provided
  let faqsValue = null;
  if (faqs) {
    try {
      const parsed = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
      faqsValue = JSON.stringify(parsed);
    } catch (e) {
      return res.status(400).json({ error: "Invalid FAQs JSON" });
    }
  }
  let itemsValue = null;
  if (items) {
    try {
      const parsed = typeof items === "string" ? JSON.parse(items) : items;
      itemsValue = JSON.stringify(parsed);
    } catch (e) {
      return res.status(400).json({ error: "Invalid items JSON" });
    }
  }

  const sql = `
    INSERT INTO blogs (title, description, urlName, image, metatitle, metadescription, faqs,items)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, formattedUrlName, imagePath, metaTitle, metaDescription, faqsValue, itemsValue],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({
        message: "Blog created successfully",
        blogId: result.insertId,
        urlName: formattedUrlName,
      });
    }
  );
};

// UPDATE BLOG
export const editBlog = (req, res) => {
  const { id } = req.params;
  const { title, description, urlName,  metaTitle, metaDescription, faqs ,items } = req.body;
  let imagePath = req.body.image;

  if (!id) return res.status(400).json({ message: "Blog ID is required" });
  if (req.file) imagePath = `${req.file.filename}`;

  const formatSlug = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const formattedUrlName = formatSlug(urlName);

  let faqsValue = null;
  if (faqs !== undefined) {
    try {
      const parsed = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
      faqsValue = JSON.stringify(parsed);
    } catch (e) {
      return res.status(400).json({ error: "Invalid FAQs JSON" });
    }
  }

  let itemsValue = null;
  if (items !== undefined) {
    try {
      const parsed = typeof items === "string" ? JSON.parse(items) : items;
      itemsValue = JSON.stringify(parsed);
    } catch (e) {
      return res.status(400).json({ error: "Invalid items JSON" });
    }
  }

  const sql = `
    UPDATE blogs 
    SET title = ?, description = ?, urlName = ?, image = ?, metatitle = ?, metadescription = ?, faqs = ?,items = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, description, formattedUrlName, imagePath, metaTitle, metaDescription, faqsValue,itemsValue , id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Blog not found" });

      res.status(200).json({ message: "Blog updated successfully", urlName: formattedUrlName });
    }
  );
};

// GET BLOG BY URL NAME
export const getBlogByUrl = (req, res) => {
  const { urlName } = req.params;
  const sql = `SELECT * FROM blogs WHERE urlName = ? LIMIT 1`;

  db.query(sql, [urlName], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Blog not found" });

    // parse content & faqs
    const blog = {
      ...results[0],
      items: results[0].items ? JSON.parse(results[0].items) : [],
      faqs: results[0].faqs ? JSON.parse(results[0].faqs) : [],
    };

    res.status(200).json(blog);
  });
};

// GET ALL BLOGS
export const getAllBlogs = (req, res) => {
  const sql = `SELECT * FROM blogs ORDER BY created_at DESC`;
  // Example in getAllBlogs.js
  db.query("SELECT * FROM blogs", (err, data) => {
    if (err) return res.status(500).json(err);
    const parsedData = data.map((blog) => ({
      ...blog,
    }));

    return res.status(200).json(parsedData);
  });
};

// DELETE BLOG
export const deleteBlog = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Blog ID is required" });
  }

  const sql = `DELETE FROM blogs WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  });
};



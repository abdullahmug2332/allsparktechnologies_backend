import db from "../db.js";

// CREATE BLOG
export const createBlog = (req, res) => {
  const { title, description, urlName, content, metaTitle, metaDescription } = req.body;
  let imagePath = null;

  if (req.file) {
    imagePath = `${req.file.filename}`;
  }

  const formatSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const formattedUrlName = formatSlug(urlName);

  const sql = `INSERT INTO blogs (title, description, urlName, image, content, metatitle, metadescription) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [title, description, formattedUrlName, imagePath, content, metaTitle, metaDescription],
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

// GET BLOG BY URL NAME
export const getBlogByUrl = (req, res) => {
  const { urlName } = req.params;
  const sql = `SELECT * FROM blogs WHERE urlName = ?`;

  db.query(sql, [urlName], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Blog not found" });
    const blog = results[0];

    res.status(200).json(blog);
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
// UPDATE BLOG
// UPDATE BLOG
export const editBlog = (req, res) => {
  const { id } = req.params;
  const { title, description, urlName, content, metaTitle, metaDescription } = req.body;
  let imagePath = req.body.image;

  if (!id) {
    return res.status(400).json({ message: "Blog ID is required" });
  }

  if (req.file) {
    imagePath = `${req.file.filename}`;
  }

  const formatSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const formattedUrlName = formatSlug(urlName);

  const sql = `
    UPDATE blogs 
    SET title = ?, description = ?, urlName = ?, image = ?, content = ?, metatitle = ?, metadescription = ? 
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, description, formattedUrlName, imagePath, content, metaTitle, metaDescription, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json({
        message: "Blog updated successfully",
        urlName: formattedUrlName,
      });
    }
  );
};


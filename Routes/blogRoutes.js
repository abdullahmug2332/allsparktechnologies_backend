import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createBlog,
  getAllBlogs,
  getBlogByUrl,
  deleteBlog,
  editBlog
} from "../Controllers/blogController.js";


const router = express.Router();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images/blogs"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Blog routes
router.get("/blogs", getAllBlogs);
router.get("/blogs/:urlName", getBlogByUrl);
router.post("/blogs", upload.single("image"), createBlog);
router.put("/blog/:id", upload.single("image"), editBlog); 
router.delete("/blog", deleteBlog);


// New route: image upload for EditorJS
router.post("/blogs/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  res.status(200).json({ filename: req.file.filename });
});

export default router;

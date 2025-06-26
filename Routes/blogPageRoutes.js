// routes/blogPageRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  getBlogData,
  updateBlogData,
  uploadBlogImage
} from "../Controllers/blogPageController.js";

const router = express.Router();

const storage = multer.diskStorage({ 
  destination: (req, file, cb) => {
    cb(null, "images/blogs");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, "blog_" + uniqueName);
  },
});
const upload = multer({ storage });


router.get("/blogdata", getBlogData);
router.put("/blogdata", updateBlogData); 
router.post("/upload-blog-image", upload.single("image"), uploadBlogImage);

export default router;

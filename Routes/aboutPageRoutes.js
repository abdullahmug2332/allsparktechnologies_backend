import express from "express";
import multer from "multer";
import path from "path";
import { aboutData, updateAboutData,uploadAboutImage } from "../Controllers/aboutPageController.js";

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/about");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, "about_hero_" + uniqueSuffix);
  },
});

const upload = multer({ storage });

const router = express.Router();
router.get("/aboutdata", aboutData);
router.put("/aboutdata", updateAboutData);
router.post("/upload-about-image", upload.single("image"), uploadAboutImage); // <- NEW


export default router;
 
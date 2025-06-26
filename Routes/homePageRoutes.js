import express from "express";
import multer from "multer";
import path from "path";
import {
  homeData,
  updateHomeData,
  uploadHomeImage
} from "../Controllers/homePageController.js";

// Setup multer
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => {
    cb(null, "images/home");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, "home_" + uniqueName);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get("/homedata", homeData);
router.put("/homedata", updateHomeData);
router.post("/upload-home-image", upload.single("image"), uploadHomeImage); // 👈 new route

export default router;

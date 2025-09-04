import express from "express";
import multer from "multer";
import path from "path";
import { postServicePageByName, putServicePageByName, uploadServiceImage } from "../Controllers/servicePageController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/services"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, "service_" + uniqueName);
  },
});
const upload = multer({ storage });

router.post("/service", postServicePageByName);
router.put("/service", putServicePageByName);
router.post("/upload-service-image", upload.single("image"), uploadServiceImage); // ✅ NEW

export default router;
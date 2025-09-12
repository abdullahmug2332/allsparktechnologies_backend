import express from "express";
import multer from "multer";
import path from "path";
import {
  contactData,
  updateContactData,
  uploadContactImage,
} from "../Controllers/contactPageController.js";

const router = express.Router(); 

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/contact"); // store in /images folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, "contact_hero_" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// Routes
router.get("/contactdata", contactData);
router.put("/contactdata", updateContactData);
router.post("/upload-contact-image", upload.single("image"), uploadContactImage); // <- NEW

export default router;

// Routes/contactRoutes.js
import express from "express";
import { submitContactForm } from "../Controllers/contactFormContoller.js";

const router = express.Router();

router.post("/api/contact", submitContactForm);

export default router;

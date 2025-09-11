// Routes/contactRoutes.js
import express from "express";
import { getAllContacts, getContactById, submitContactForm } from "../Controllers/contactFormContoller.js";

const router = express.Router();

router.post("/api/contact", submitContactForm);
router.get("/contact-messages", getAllContacts);
router.get("/contact-messages/:id", getContactById);

export default router;

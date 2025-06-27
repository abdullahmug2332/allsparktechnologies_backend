import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../Controllers/propertyController.js";

const router = express.Router();

router.post("/properties", createProperty);
router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);
router.put("/properties/:id", updateProperty);
router.delete("/properties/:id", deleteProperty);

export default router;

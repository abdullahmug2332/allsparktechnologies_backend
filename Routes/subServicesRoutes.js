import express from "express";
import {
  getSubservicesByService,
  getSubserviceBySlug,
  updateSubservice
} from "../Controllers/subServicesController.js";

const router = express.Router();

router.post("/getbyservice", getSubservicesByService);
router.post("/getbyslug", getSubserviceBySlug);
router.put("/update", updateSubservice);

export default router;

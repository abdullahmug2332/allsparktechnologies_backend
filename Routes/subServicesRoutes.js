import express from "express";
import {
  getSubservicesByService,
  getSubserviceBySlug,
  updateSubservice,
  getAllSubserviceSlugs
} from "../Controllers/subServicesController.js";

const router = express.Router();

router.post("/getbyservice", getSubservicesByService);
router.post("/getbyslug", getSubserviceBySlug);
router.put("/updatesubservice", updateSubservice);
router.get("/getslug", getAllSubserviceSlugs);

export default router;

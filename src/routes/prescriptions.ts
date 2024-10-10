import { Router } from "express";
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  deletePrescription,
  updatePrescription,
} from "../controllers/prescriptionController";
import { prescriptionValidation } from "../middleware/validationMiddleware";
const router = Router();

router.post("/", prescriptionValidation, createPrescription);

router.get("/", getPrescriptions);

router.get("/:id", getPrescriptionById);

router.delete("/:id", deletePrescription);

router.patch("/:id", updatePrescription);

export default router;

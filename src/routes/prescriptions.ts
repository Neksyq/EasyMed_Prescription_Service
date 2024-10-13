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

router.post("/prescriptions", prescriptionValidation, createPrescription);

router.get("/prescriptions", getPrescriptions);

router.get("/prescriptions/:id", getPrescriptionById);

router.delete("/prescriptions/:id", deletePrescription);

router.patch("/prescriptions/:id", updatePrescription);

export default router;

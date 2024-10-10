const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  deletePrescription,
  updatePrescription
} = require("../controllers/prescriptionController");
const {
  prescriptionValidation,
} = require("../middleware/validationMiddleware");

router.post("/", prescriptionValidation, createPrescription);

router.get("/", getPrescriptions);

router.get("/:id", getPrescriptionById);

router.delete("/:id", deletePrescription);

router.patch("/:id", updatePrescription)

module.exports = router;

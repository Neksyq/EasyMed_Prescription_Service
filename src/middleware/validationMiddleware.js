const { body } = require("express-validator");

exports.prescriptionValidation = [
  // body("patientName").notEmpty().withMessage("Patient name is required."),
  // body("medication").notEmpty().withMessage("Medication is required."),
  // body("dosage").notEmpty().withMessage("Dosage is required."),
];

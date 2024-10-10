import { body, ValidationChain } from "express-validator";

// Define the validation rules for prescription
export const prescriptionValidation: ValidationChain[] = [
  body("patientName").notEmpty().withMessage("Patient name is required."),
  body("medication").notEmpty().withMessage("Medication is required."),
  body("dosage").notEmpty().withMessage("Dosage is required."),
];

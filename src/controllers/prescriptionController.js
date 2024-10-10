const prescriptionService = require("../services/prescriptionService");
const rxNormAPI = require("../apis/rxNormAPI");
const { validationResult } = require("express-validator");

// Create a new prescription
exports.createPrescription = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const rxcui = await rxNormAPI.checkMedicationInRxNorm("aspirin");
  if (!rxcui) {
    return res
      .status(400)
      .json({ error: "Invalid medication. Medication not found in RxNorm." });
  }
  try {
    req.body.rxcui = rxcui;
    const prescription = await prescriptionService.create(req.body);
    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
};

// Get all prescriptions
exports.getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await prescriptionService.getAll();
    res.status(200).json(prescriptions);
  } catch (error) {
    next(error);
  }
};

// Get prescription by id
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.getById(req.params.id);
    if (prescription.length === 0) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    res.status(200).json(prescription[0]);
  } catch (error) {
    next(error);
  }
};

// Delete a prescription by ID
exports.deletePrescription = async (req, res, next) => {
  try {
    const deleted = await prescriptionService.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//Update a prescription by ID (optimized and flexible)
exports.updatePrescription = async (req, res) => {
  const { id } = req.params;

  const allowedColumns = ["patient_name", "medication", "dosage"];

  const fieldsToUpdate = Object.keys(req.body).filter(
    (key) =>
      req.body[key] !== undefined &&
      req.body[key] !== null &&
      allowedColumns.includes(key)
  );

  if (fieldsToUpdate.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update" });
  }

  const fields = fieldsToUpdate.map((field) => `${field} = ?`);
  const values = fieldsToUpdate.map((field) => req.body[field]);

  values.push(id);

  try {
    const result = await prescriptionService.update(fields, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    const [updatedPrescription] = await prescriptionService.getById(id);

    res.status(200).json(updatedPrescription[0]);
  } catch (error) {
    console.error("Failed to update prescription:", error);
    res.status(500).json({ error: "Failed to update prescription" });
  }
};

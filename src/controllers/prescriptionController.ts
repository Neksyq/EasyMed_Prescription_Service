import { Request, Response, NextFunction } from "express";
import {
  getAll,
  getById,
  deleteById,
  update,
  create,
} from "../services/prescriptionService";
import { checkMedicationInRxNorm } from "../externalAPIs/rxNormAPI";
import { validationResult } from "express-validator";

// Create a new prescription
export const createPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const rxcui = await checkMedicationInRxNorm("aspirin");
    if (!rxcui) {
      res
        .status(400)
        .json({ error: "Invalid medication. Medication not found in RxNorm." });
      return;
    }

    req.body.rxcui = rxcui;
    const prescription = await create(req.body);
    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
};

// Get all prescriptions
export const getPrescriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prescriptions = await getAll();
    res.status(200).json(prescriptions);
  } catch (error) {
    next(error);
  }
};

// Get prescription by id
export const getPrescriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prescription = await getById(req.params.id);
    if (!prescription || prescription.length === 0) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }
    res.status(200).json(prescription[0]);
  } catch (error) {
    next(error);
  }
};

// Delete a prescription by ID
export const deletePrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await deleteById(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }
    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Update a prescription by ID (optimized and flexible)
export const updatePrescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const allowedColumns = ["patient_name", "medication", "dosage"];
  const fieldsToUpdate = Object.keys(req.body).filter(
    (key) =>
      req.body[key] !== undefined &&
      req.body[key] !== null &&
      allowedColumns.includes(key)
  );

  if (fieldsToUpdate.length === 0) {
    res.status(400).json({ error: "No valid fields provided for update" });
    return;
  }

  const fields = fieldsToUpdate.map((field) => `${field} = ?`);
  const values = fieldsToUpdate.map((field) => req.body[field]);
  values.push(id);

  try {
    const result = await update(fields, values);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }

    const [updatedPrescription] = await getById(id);
    res.status(200).json(updatedPrescription[0]);
  } catch (error) {
    console.error("Failed to update prescription:", error);
    res.status(500).json({ error: "Failed to update prescription" });
  }
};

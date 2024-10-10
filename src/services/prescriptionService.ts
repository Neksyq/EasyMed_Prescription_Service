import pool from "../config/db";
import { ResultSetHeader } from "mysql2/promise";
import { encrypt, decrypt } from "../helpers/encryption"; // Import encryption utilities

interface PrescriptionBody {
  rxcui: string;
  medication_name: string;
  patient_id: number;
  prescriber_id: number;
  dosage: string;
  valid_from: string;
  valid_until: string;
}

export const create = async (
  body: PrescriptionBody
): Promise<{ success: boolean; insertId: number }> => {
  const encryptedMedicationName = encrypt(body.medication_name); // Encrypt medication name
  const encryptedDosage = encrypt(body.dosage); // Encrypt dosage
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO prescriptions 
     (rxcui, medication_name, patient_id, prescriber_id, dosage, valid_from, valid_until) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      body.rxcui,
      encryptedMedicationName,
      body.patient_id,
      body.prescriber_id,
      encryptedDosage,
      body.valid_from,
      body.valid_until,
    ]
  );

  return { success: true, insertId: result.insertId! };
};

export const getAll = async (): Promise<any[]> => {
  const [result] = await pool.query<any[]>("SELECT * FROM prescriptions");
  return result;
};

export const getById = async (id: string): Promise<any> => {
  const [result] = await pool.query<any[]>(
    "SELECT * FROM prescriptions WHERE id=?",
    [id]
  );
  const prescription = result[0];

  prescription.medication_name = decrypt(prescription.medication_name);
  prescription.dosage = decrypt(prescription.dosage);
  return prescription;
};

export const deleteById = async (id: string): Promise<any> => {
  const [result] = await pool.query("DELETE FROM prescriptions WHERE id=?", [
    id,
  ]);
  return result;
};

export const update = async (fields: string[], values: any[]): Promise<any> => {
  const query = `UPDATE prescriptions SET ${fields.join(", ")} WHERE id = ?`;
  const [result] = await pool.query(query, values);
  return result;
};

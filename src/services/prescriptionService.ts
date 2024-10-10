import pool from "../config/db";
import { ResultSetHeader } from "mysql2/promise";

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
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO prescriptions 
     (rxcui, medication_name, patient_id, prescriber_id, dosage, valid_from, valid_until) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      body.rxcui,
      body.medication_name,
      body.patient_id,
      body.prescriber_id,
      body.dosage,
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
  return result[0]; // Assuming only one result is returned.
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

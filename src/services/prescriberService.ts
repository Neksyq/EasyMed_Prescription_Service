import pool from "../config/db";
import { ResultSetHeader } from "mysql2/promise";

interface PrescriberBody {
  prescriberId: number;
  email: string;
  first_name: string;
  last_name: string;
  specialty: string;
  medical_license_number: string;
  license_issuing_country: string;
  affiliated_hospital: string;
  gender?: string;
  phone_number?: string;
}

interface CreatePrescriberResponse {
  success: boolean;
  insertId?: number;
  error?: unknown;
}

const executeQuery = async (
  query: string,
  values: Array<any>
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(query, values);
  return result;
};

// Create new prescriber function
export const createNewPrescriber = async (
  body: PrescriberBody
): Promise<CreatePrescriberResponse> => {
  const query = `
    INSERT INTO prescribers 
    (prescriber_id, email, first_name, last_name, specialty, medical_license_number, license_issuing_country, affiliated_hospital, gender, phone_number) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    body.prescriberId,
    body.email,
    body.first_name,
    body.last_name,
    body.specialty,
    body.medical_license_number,
    body.license_issuing_country,
    body.affiliated_hospital,
    body.gender,
    body.phone_number,
  ];

  try {
    const result = await executeQuery(query, values);
    return { success: true, insertId: result.insertId! };
  } catch (error) {
    console.error("Error inserting new prescriber:", error); // Better error logging
    return { success: false, error };
  }
};

export const checkIfPrescriberExists = async (
  prescriberId?: number
): Promise<boolean> => {
  try {
    let query = `SELECT COUNT(*) AS count FROM prescribers WHERE prescriber_id = ?`;
    const rows = await pool.query<ResultSetHeader>(query, [prescriberId]);
    return rows[0].fieldCount > 0;
  } catch (error) {
    console.error("Error checking if prescriber exists:", error);
    throw new Error("Failed to check if prescriber exists");
  }
};

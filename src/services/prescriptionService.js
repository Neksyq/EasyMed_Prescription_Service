const pool = require("../config/db");

exports.create = async (body) => {
  const result = await pool.query(
    "INSERT INTO prescriptions (rxcui, medication_name, patient_id, prescriber_id, dosage, valid_from, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [body.rxcui, body.medication_name, body.patient_id, body.prescriber_id, body.dosage, body.valid_from, body.valid_until]  );

  return { success: true, insertId: result[0].insertId };
};

exports.getAll = async () => {
  const [result] = await pool.query("SELECT * FROM prescriptions");
  return result;
};

exports.getById = async (id) => {
  const [result] = await pool.query("SELECT * FROM prescriptions WHERE id=?", [
    id,
  ]);
  return result;
};

exports.delete = async (id) => {
  const result = await pool.query("DELETE FROM prescriptions WHERE id=?", [id]);
  return result;
};

exports.update = async (fields, values) => {
  const query = `UPDATE prescriptions SET ${fields.join(", ")} WHERE id = ?`;
  const [result] = await pool.query(query, values);
  return result
};


import pool from "../config/db.js";

export const getAllVendors = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM vendors ORDER BY vendor_id DESC"
    );
    return rows;
};

export const getVendorById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM vendors WHERE vendor_id = ?",
        [id]
    );
    return rows[0];
};

export const searchVendors = async (search) => {
    const term = `%${search}%`;

    const [rows] = await pool.query(
        `SELECT * FROM vendors
         WHERE vendor_name LIKE ?
         OR phone_number LIKE ?
         OR location LIKE ?
         ORDER BY vendor_id DESC`,
        [term, term, term]
    );

    return rows;
};

export const createVendor = async (data) => {
    const { vendor_name, phone_number, location, registration_date } = data;

    const [result] = await pool.query(
        `INSERT INTO vendors
        (vendor_name, phone_number, location, registration_date)
        VALUES (?, ?, ?, ?)`,
        [vendor_name, phone_number, location, registration_date]
    );

    return getVendorById(result.insertId);
};

export const updateVendor = async (id, data) => {
    const { vendor_name, phone_number, location, registration_date } = data;

    const [result] = await pool.query(
        `UPDATE vendors
         SET vendor_name = ?, phone_number = ?,
             location = ?, registration_date = ?
         WHERE vendor_id = ?`,
        [vendor_name, phone_number, location, registration_date, id]
    );

    if (!result.affectedRows) return null;
    return getVendorById(id);
};

export const deleteVendor = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM vendors WHERE vendor_id = ?",
        [id]
    );
    return result.affectedRows > 0;
};

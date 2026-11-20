
import pool from "../config/db.js";

export const getAllSuppliers = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM suppliers ORDER BY supplier_id DESC"
    );
    return rows;
};

export const getSupplierById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM suppliers WHERE supplier_id = ?",
        [id]
    );
    return rows[0];
};

export const createSupplier = async (data) => {
    const { business_name, contact_person, phone, province, address } = data;

    const [result] = await pool.query(
        `INSERT INTO suppliers
        (business_name, contact_person, phone, province, address)
        VALUES (?, ?, ?, ?, ?)`,
        [business_name, contact_person, phone, province, address]
    );

    return getSupplierById(result.insertId);
};

export const updateSupplier = async (id, data) => {
    const { business_name, contact_person, phone, province, address } = data;

    const [result] = await pool.query(
        `UPDATE suppliers
         SET business_name = ?, contact_person = ?, phone = ?,
             province = ?, address = ?
         WHERE supplier_id = ?`,
        [business_name, contact_person, phone, province, address, id]
    );

    if (!result.affectedRows) return null;
    return getSupplierById(id);
};

export const deleteSupplier = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM suppliers WHERE supplier_id = ?",
        [id]
    );
    return result.affectedRows > 0;
};

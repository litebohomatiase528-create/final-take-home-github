
import pool from "../config/db.js";

export const getAllFruits = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM fruits ORDER BY fruit_id DESC"
    );
    return rows;
};

export const getFruitById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM fruits WHERE fruit_id = ?",
        [id]
    );
    return rows[0];
};

export const createFruit = async (data) => {
    const { fruit_name, description, status } = data;

    const [result] = await pool.query(
        `INSERT INTO fruits (fruit_name, description, status)
         VALUES (?, ?, ?)`,
        [fruit_name, description || null, status || "Available"]
    );

    return getFruitById(result.insertId);
};

export const updateFruit = async (id, data) => {
    const { fruit_name, description, status } = data;

    const [result] = await pool.query(
        `UPDATE fruits
         SET fruit_name = ?, description = ?, status = ?
         WHERE fruit_id = ?`,
        [fruit_name, description || null, status, id]
    );

    if (!result.affectedRows) return null;
    return getFruitById(id);
};

export const deleteFruit = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM fruits WHERE fruit_id = ?",
        [id]
    );
    return result.affectedRows > 0;
};


import pool from "../config/db.js";

export const getAllStock = async () => {
    const [rows] = await pool.query(
        `SELECT
            s.stock_id,
            s.fruit_id,
            f.fruit_name,
            s.packaging_size,
            s.available_quantity
         FROM stock s
         INNER JOIN fruits f ON s.fruit_id = f.fruit_id
         ORDER BY f.fruit_name,
         FIELD(s.packaging_size, 'Small', 'Medium', 'Large')`
    );

    return rows;
};

export const getStockByFruit = async (fruitId) => {
    const [rows] = await pool.query(
        `SELECT s.*, f.fruit_name
         FROM stock s
         INNER JOIN fruits f ON s.fruit_id = f.fruit_id
         WHERE s.fruit_id = ?
         ORDER BY FIELD(s.packaging_size, 'Small', 'Medium', 'Large')`,
        [fruitId]
    );

    return rows;
};

export const getLowStock = async (threshold = 10) => {
    const [rows] = await pool.query(
        `SELECT s.stock_id, s.fruit_id, f.fruit_name,
                s.packaging_size, s.available_quantity
         FROM stock s
         INNER JOIN fruits f ON s.fruit_id = f.fruit_id
         WHERE s.available_quantity <= ?
         ORDER BY s.available_quantity ASC`,
        [threshold]
    );

    return rows;
};

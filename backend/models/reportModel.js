
import pool from "../config/db.js";

// TOP FIVE MOST FREQUENTLY SOLD FRUITS
export const getTopFruits = async () => {
    const [rows] = await pool.query(`
        SELECT
            f.fruit_id,
            f.fruit_name,
            SUM(sd.quantity) AS total_quantity
        FROM Sales_Details sd
        INNER JOIN Fruits f
            ON sd.fruit_id = f.fruit_id
        GROUP BY f.fruit_id, f.fruit_name
        ORDER BY total_quantity DESC
        LIMIT 5
    `);

    return rows;
};

// SALES REVENUE REPORT
export const getRevenueReport = async (startDate, endDate) => {
    const [rows] = await pool.query(`
        SELECT
            sale_date,
            SUM(total_amount) AS total_revenue
        FROM Sales
        WHERE sale_date BETWEEN ? AND ?
        GROUP BY sale_date
        ORDER BY sale_date
    `, [startDate, endDate]);

    return rows;
};

// TOP VENDOR BY QUANTITY PURCHASED
export const getTopVendor = async () => {
    const [rows] = await pool.query(`
        SELECT
            v.vendor_id,
            v.vendor_name,
            SUM(sd.quantity) AS total_boxes
        FROM Sales s
        INNER JOIN Vendors v
            ON s.vendor_id = v.vendor_id
        INNER JOIN Sales_Details sd
            ON s.sale_id = sd.sale_id
        GROUP BY v.vendor_id, v.vendor_name
        ORDER BY total_boxes DESC
        LIMIT 1
    `);

    return rows[0] || null;
};

// CURRENT STOCK REPORT
export const getCurrentStock = async () => {
    const [rows] = await pool.query(`
        SELECT
            f.fruit_name,
            s.packaging_size,
            s.available_quantity
        FROM Stock s
        INNER JOIN Fruits f
            ON s.fruit_id = f.fruit_id
        ORDER BY
            f.fruit_name,
            FIELD(s.packaging_size, 'Small', 'Medium', 'Large')
    `);

    return rows;
};

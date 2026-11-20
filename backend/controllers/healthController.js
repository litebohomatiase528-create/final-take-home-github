
import pool from "../config/db.js";

export const checkHealth = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT DATABASE() AS database_name"
        );

        res.status(200).json({
            status: "OK",
            message: "Backend and database are connected.",
            database: rows[0].database_name
        });
    } catch (error) {
        res.status(503).json({
            status: "ERROR",
            message: "Database connection is unavailable."
        });
    }
};


import pool from "../config/db.js";

export const getAllPurchases = async () => {
    const [rows] = await pool.query(
        `SELECT p.purchase_id, p.supplier_id,
                su.business_name, p.purchase_date, p.total_amount
         FROM purchases p
         INNER JOIN suppliers su ON p.supplier_id = su.supplier_id
         ORDER BY p.purchase_id DESC`
    );

    return rows;
};

export const getPurchaseDetails = async (id) => {
    const [rows] = await pool.query(
        `SELECT pd.*, f.fruit_name
         FROM purchase_details pd
         INNER JOIN fruits f ON pd.fruit_id = f.fruit_id
         WHERE pd.purchase_id = ?`,
        [id]
    );

    return rows;
};

export const createPurchase = async (data) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { supplier_id, purchase_date, items } = data;

        const [supplier] = await connection.query(
            "SELECT supplier_id FROM suppliers WHERE supplier_id = ?",
            [supplier_id]
        );

        if (!supplier.length) {
            const error = new Error("Supplier not found.");
            error.statusCode = 404;
            throw error;
        }

        let total = 0;

        for (const item of items) {
            const quantity = Number(item.quantity);
            const unitCost = Number(item.unit_cost);

            if (!Number.isInteger(quantity) || quantity <= 0 ||
                !Number.isFinite(unitCost) || unitCost < 0) {
                const error = new Error("Invalid purchase quantity or unit cost.");
                error.statusCode = 400;
                throw error;
            }

            const [fruit] = await connection.query(
                "SELECT fruit_id FROM fruits WHERE fruit_id = ?",
                [item.fruit_id]
            );

            if (!fruit.length) {
                const error = new Error(`Fruit ${item.fruit_id} was not found.`);
                error.statusCode = 404;
                throw error;
            }

            if (!["Small", "Medium", "Large"].includes(item.packaging_size)) {
                const error = new Error("Invalid packaging size.");
                error.statusCode = 400;
                throw error;
            }

            total += quantity * unitCost;
        }

        const [purchaseResult] = await connection.query(
            `INSERT INTO purchases
             (supplier_id, purchase_date, total_amount)
             VALUES (?, ?, ?)`,
            [supplier_id, purchase_date, total]
        );

        const purchaseId = purchaseResult.insertId;

        for (const item of items) {
            await connection.query(
                `INSERT INTO purchase_details
                 (purchase_id, fruit_id, quantity, unit_cost, packaging_size)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    purchaseId,
                    item.fruit_id,
                    item.quantity,
                    item.unit_cost,
                    item.packaging_size
                ]
            );

            await connection.query(
                `INSERT INTO stock
                 (fruit_id, packaging_size, available_quantity)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                 available_quantity = available_quantity + VALUES(available_quantity)`,
                [item.fruit_id, item.packaging_size, item.quantity]
            );
        }

        await connection.commit();

        return {
            purchase_id: purchaseId,
            supplier_id,
            purchase_date,
            total_amount: total
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};


import pool from "../config/db.js";

export const getAllSales = async () => {
    const [rows] = await pool.query(
        `SELECT s.sale_id, s.vendor_id, v.vendor_name,
                s.sale_date, s.payment_status, s.payment_method,
                s.total_amount, s.amount_paid,
                (s.total_amount - s.amount_paid) AS balance
         FROM sales s
         INNER JOIN vendors v ON s.vendor_id = v.vendor_id
         ORDER BY s.sale_id DESC`
    );

    return rows;
};

export const getSaleDetails = async (id) => {
    const [rows] = await pool.query(
        `SELECT sd.*, f.fruit_name
         FROM sales_details sd
         INNER JOIN fruits f ON sd.fruit_id = f.fruit_id
         WHERE sd.sale_id = ?`,
        [id]
    );

    return rows;
};

export const createSale = async (data) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            vendor_id,
            sale_date,
            payment_method,
            amount_paid = 0,
            items
        } = data;

        const [vendor] = await connection.query(
            "SELECT vendor_id FROM vendors WHERE vendor_id = ?",
            [vendor_id]
        );

        if (!vendor.length) {
            const error = new Error("Vendor not found.");
            error.statusCode = 404;
            throw error;
        }

        if (!["Cash", "Mobile Money", "Credit"].includes(payment_method)) {
            const error = new Error("Invalid payment method.");
            error.statusCode = 400;
            throw error;
        }

        if (!Array.isArray(items) || items.length === 0) {
            const error = new Error("A sale must contain at least one item.");
            error.statusCode = 400;
            throw error;
        }

        let total = 0;
        const validatedItems = [];

        for (const item of items) {
            const quantity = Number(item.quantity);
            const unitPrice = Number(item.unit_price);

            if (!Number.isInteger(quantity) || quantity <= 0 ||
                !Number.isFinite(unitPrice) || unitPrice < 0) {
                const error = new Error("Invalid sale quantity or unit price.");
                error.statusCode = 400;
                throw error;
            }

            if (!["Small", "Medium", "Large"].includes(item.packaging_size)) {
                const error = new Error("Invalid packaging size.");
                error.statusCode = 400;
                throw error;
            }

            const [stockRows] = await connection.query(
                `SELECT available_quantity
                 FROM stock
                 WHERE fruit_id = ? AND packaging_size = ?
                 FOR UPDATE`,
                [item.fruit_id, item.packaging_size]
            );

            if (!stockRows.length || stockRows[0].available_quantity < quantity) {
                const error = new Error(
                    `Insufficient stock for fruit ID ${item.fruit_id} (${item.packaging_size}).`
                );
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

            total += quantity * unitPrice;

            validatedItems.push({
                fruit_id: item.fruit_id,
                packaging_size: item.packaging_size,
                quantity,
                unit_price: unitPrice
            });
        }

        const paid = Number(amount_paid);

        if (!Number.isFinite(paid) || paid < 0 || paid > total) {
            const error = new Error("Amount paid must be between zero and the sale total.");
            error.statusCode = 400;
            throw error;
        }

        const paymentStatus =
            paid >= total ? "PAID" :
            paid > 0 ? "PARTIALLY_PAID" : "UNPAID";

        const [saleResult] = await connection.query(
            `INSERT INTO sales
             (vendor_id, sale_date, payment_status, payment_method,
              total_amount, amount_paid)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [vendor_id, sale_date, paymentStatus, payment_method, total, paid]
        );

        const saleId = saleResult.insertId;

        for (const item of validatedItems) {
            await connection.query(
                `INSERT INTO sales_details
                 (sale_id, fruit_id, packaging_size, quantity, unit_price)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    saleId,
                    item.fruit_id,
                    item.packaging_size,
                    item.quantity,
                    item.unit_price
                ]
            );

            await connection.query(
                `UPDATE stock
                 SET available_quantity = available_quantity - ?
                 WHERE fruit_id = ? AND packaging_size = ?`,
                [item.quantity, item.fruit_id, item.packaging_size]
            );
        }

        await connection.commit();

        return {
            sale_id: saleId,
            vendor_id,
            sale_date,
            payment_status: paymentStatus,
            payment_method,
            total_amount: total,
            amount_paid: paid,
            balance: total - paid
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

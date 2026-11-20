
import db from "../config/db.js";

const getSales = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        sa.*,
        v.vendor_name,
        (sa.total_amount - sa.amount_paid) AS outstanding_balance
      FROM sales sa
      JOIN vendors v ON sa.vendor_id = v.vendor_id
      ORDER BY sa.sale_id DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const addSale = async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    const {
      vendor_id,
      sale_date,
      payment_method,
      amount_paid = 0,
      items
    } = req.body;

    if (!vendor_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Vendor and at least one sales item are required"
      });
    }

    if (!["Cash", "Mobile Money", "Credit"].includes(payment_method)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    let total = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unit_price);

      if (
        !Number.isInteger(Number(item.fruit_id)) ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        !["Small", "Medium", "Large"].includes(item.packaging_size) ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        return res.status(400).json({ message: "Invalid sales item" });
      }

      total += quantity * unitPrice;
    }

    const paid = Number(amount_paid);

    if (!Number.isFinite(paid) || paid < 0 || paid > total) {
      return res.status(400).json({
        message: "Amount paid must be between zero and the total amount"
      });
    }

    const paymentStatus =
      paid >= total ? "PAID" :
      paid > 0 ? "PARTIALLY_PAID" : "UNPAID";

    await connection.beginTransaction();

    const [vendor] = await connection.query(
      "SELECT vendor_id FROM vendors WHERE vendor_id=?",
      [vendor_id]
    );

    if (!vendor.length) {
      throw new Error("Vendor not found");
    }

    // Combine duplicate fruit/packaging items before checking stock.
    const groupedItems = new Map();

    for (const item of items) {
      const key = `${item.fruit_id}-${item.packaging_size}`;
      const existing = groupedItems.get(key);

      if (existing) {
        existing.quantity += Number(item.quantity);
      } else {
        groupedItems.set(key, { ...item, quantity: Number(item.quantity) });
      }
    }

    const [sale] = await connection.query(
      `INSERT INTO sales
       (vendor_id, sale_date, payment_status, payment_method,
        total_amount, amount_paid)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        vendor_id,
        sale_date || new Date(),
        paymentStatus,
        payment_method,
        total.toFixed(2),
        paid.toFixed(2)
      ]
    );

    for (const item of groupedItems.values()) {
      const [stock] = await connection.query(
        `SELECT stock_id, available_quantity
         FROM stock
         WHERE fruit_id=? AND packaging_size=?
         FOR UPDATE`,
        [item.fruit_id, item.packaging_size]
      );

      if (!stock.length || stock[0].available_quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for fruit ID ${item.fruit_id} (${item.packaging_size})`
        );
      }

      await connection.query(
        `INSERT INTO sales_details
         (sale_id, fruit_id, packaging_size, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?)`,
        [
          sale.insertId,
          item.fruit_id,
          item.packaging_size,
          item.quantity,
          item.unit_price
        ]
      );

      await connection.query(
        `UPDATE stock
         SET available_quantity = available_quantity - ?
         WHERE stock_id=?`,
        [item.quantity, stock[0].stock_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Sale recorded and stock updated successfully",
      sale_id: sale.insertId,
      total_amount: Number(total.toFixed(2)),
      amount_paid: paid,
      outstanding_balance: Number((total - paid).toFixed(2)),
      payment_status: paymentStatus
    });
  } catch (error) {
    await connection.rollback();

    if (error.message === "Vendor not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message.startsWith("Insufficient stock")) {
      return res.status(400).json({ message: error.message });
    }

    next(error);
  } finally {
    connection.release();
  }
};

module.exports = { getSales, addSale };

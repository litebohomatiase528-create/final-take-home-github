
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// REPORT ROUTES
app.use("/api/reports", reportRoutes);

// DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "batloung_farm",
    waitForConnections: true,
    connectionLimit: 10
});

// TEST ROUTES
app.get("/", (req, res) => {
    res.send("Welcome to Batloung Farm");
});

app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS database_name"
        );

        res.json({
            success: true,
            message: "Backend and MySQL are connected!",
            database: rows[0].database_name
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// DASHBOARD
app.get("/api/dashboard", async (req, res) => {
    try {
        const [[suppliers]] = await db.query(
            "SELECT COUNT(*) AS total FROM Suppliers"
        );

        const [[vendors]] = await db.query(
            "SELECT COUNT(*) AS total FROM Vendors"
        );

        const [[fruits]] = await db.query(
            "SELECT COUNT(*) AS total FROM Fruits"
        );

        const [[stock]] = await db.query(
            "SELECT COALESCE(SUM(available_quantity), 0) AS total FROM Stock"
        );

        const [[sales]] = await db.query(
            "SELECT COALESCE(SUM(total_amount), 0) AS total FROM Sales"
        );

        res.json({
            success: true,
            suppliers: suppliers.total,
            vendors: vendors.total,
            fruits: fruits.total,
            stock: stock.total,
            sales: sales.total
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// SUPPLIERS
app.get("/api/suppliers", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Suppliers ORDER BY supplier_id DESC"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/api/suppliers", async (req, res) => {
    try {
        const {
            business_name,
            contact_person,
            phone,
            province,
            address
        } = req.body;

        if (!business_name || !contact_person || !phone || !province || !address) {
            return res.status(400).json({
                message: "Complete all supplier fields."
            });
        }

        await db.query(
            `INSERT INTO Suppliers
            (business_name, contact_person, phone, province, address)
            VALUES (?, ?, ?, ?, ?)`,
            [business_name, contact_person, phone, province, address]
        );

        res.status(201).json({
            message: "Supplier added successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.put("/api/suppliers/:id", async (req, res) => {
    try {
        const {
            business_name,
            contact_person,
            phone,
            province,
            address
        } = req.body;

        const [result] = await db.query(
            `UPDATE Suppliers SET
            business_name=?, contact_person=?, phone=?, province=?, address=?
            WHERE supplier_id=?`,
            [
                business_name,
                contact_person,
                phone,
                province,
                address,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Supplier not found."
            });
        }

        res.json({
            message: "Supplier updated successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.delete("/api/suppliers/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM Suppliers WHERE supplier_id=?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Supplier not found."
            });
        }

        res.json({
            message: "Supplier deleted successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: "This supplier may have existing purchases and cannot be deleted."
        });
    }
});

// VENDORS
app.get("/api/vendors", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Vendors ORDER BY vendor_id DESC"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/api/vendors", async (req, res) => {
    try {
        const {
            vendor_name,
            phone_number,
            location,
            registration_date
        } = req.body;

        if (!vendor_name || !phone_number || !location || !registration_date) {
            return res.status(400).json({
                message: "Complete all vendor fields."
            });
        }

        await db.query(
            `INSERT INTO Vendors
            (vendor_name, phone_number, location, registration_date)
            VALUES (?, ?, ?, ?)`,
            [vendor_name, phone_number, location, registration_date]
        );

        res.status(201).json({
            message: "Vendor added successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.put("/api/vendors/:id", async (req, res) => {
    try {
        const {
            vendor_name,
            phone_number,
            location,
            registration_date
        } = req.body;

        const [result] = await db.query(
            `UPDATE Vendors SET
            vendor_name=?, phone_number=?, location=?, registration_date=?
            WHERE vendor_id=?`,
            [
                vendor_name,
                phone_number,
                location,
                registration_date,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Vendor not found."
            });
        }

        res.json({
            message: "Vendor updated successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.delete("/api/vendors/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM Vendors WHERE vendor_id=?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Vendor not found."
            });
        }

        res.json({
            message: "Vendor deleted successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: "This vendor may have existing sales and cannot be deleted."
        });
    }
});

// FRUITS
app.get("/api/fruits", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Fruits ORDER BY fruit_id"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// ADD FRUIT
app.post("/api/fruits", async (req, res) => {
    try {
        const { fruit_name, description, status } = req.body;

        if (typeof fruit_name !== "string" || !fruit_name.trim()) {
            return res.status(400).json({
                message: "Enter a fruit name."
            });
        }

        if (status && !["Available", "Unavailable"].includes(status)) {
            return res.status(400).json({
                message: "Invalid fruit status."
            });
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO Fruits
                (fruit_name, description, status)
                VALUES (?, ?, ?)`,
                [
                    fruit_name.trim(),
                    description || null,
                    status || "Available"
                ]
            );

            for (const size of ["Small", "Medium", "Large"]) {
                await connection.query(
                    `INSERT INTO Stock
                    (fruit_id, packaging_size, available_quantity)
                    VALUES (?, ?, 0)`,
                    [result.insertId, size]
                );
            }

            await connection.commit();

            res.status(201).json({
                message: "Fruit added successfully."
            });

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// EDIT FRUIT
app.put("/api/fruits/:id", async (req, res) => {
    try {
        const { fruit_name, description, status } = req.body;

        if (typeof fruit_name !== "string" || !fruit_name.trim()) {
            return res.status(400).json({
                message: "Enter a fruit name."
            });
        }

        if (!["Available", "Unavailable"].includes(status)) {
            return res.status(400).json({
                message: "Invalid fruit status."
            });
        }

        const [result] = await db.query(
            `UPDATE Fruits
             SET fruit_name = ?, description = ?, status = ?
             WHERE fruit_id = ?`,
            [
                fruit_name.trim(),
                description || null,
                status,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Fruit not found."
            });
        }

        res.json({
            message: "Fruit updated successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE FRUIT
app.delete("/api/fruits/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM Fruits WHERE fruit_id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Fruit not found."
            });
        }

        res.json({
            message: "Fruit deleted successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: "This fruit cannot be deleted because it may have existing stock, purchases or sales."
        });
    }
});

// STOCK
app.get("/api/stock", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                Stock.stock_id,
                Fruits.fruit_name,
                Stock.fruit_id,
                Stock.packaging_size,
                Stock.available_quantity
            FROM Stock
            JOIN Fruits ON Stock.fruit_id = Fruits.fruit_id
            ORDER BY Fruits.fruit_name, Stock.packaging_size
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// PURCHASES
app.get("/api/purchases", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT Purchases.*, Suppliers.business_name
            FROM Purchases
            JOIN Suppliers ON Purchases.supplier_id = Suppliers.supplier_id
            ORDER BY Purchases.purchase_id DESC
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/api/purchases", async (req, res) => {
    let connection;

    try {
        const { supplier_id, purchase_date, items } = req.body;

        if (!supplier_id || !purchase_date || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Enter supplier, date and purchase items."
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        let total = 0;

        for (const item of items) {
            const quantity = Number(item.quantity);
            const cost = Number(item.unit_cost);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0 ||
                !Number.isFinite(cost) ||
                cost < 0 ||
                !["Small", "Medium", "Large"].includes(item.packaging_size)
            ) {
                throw new Error(
                    "Check the purchase quantities, costs and packaging sizes."
                );
            }

            const [fruit] = await connection.query(
                "SELECT fruit_id FROM Fruits WHERE fruit_id=?",
                [item.fruit_id]
            );

            if (fruit.length === 0) {
                throw new Error("Fruit not found.");
            }

            total += quantity * cost;
        }

        const [purchase] = await connection.query(
            `INSERT INTO Purchases
            (supplier_id, purchase_date, total_amount)
            VALUES (?, ?, ?)`,
            [supplier_id, purchase_date, total]
        );

        for (const item of items) {
            await connection.query(
                `INSERT INTO Purchase_Details
                (purchase_id, fruit_id, quantity, unit_cost, packaging_size)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    purchase.insertId,
                    item.fruit_id,
                    item.quantity,
                    item.unit_cost,
                    item.packaging_size
                ]
            );

            await connection.query(
                `UPDATE Stock
                 SET available_quantity = available_quantity + ?
                 WHERE fruit_id=? AND packaging_size=?`,
                [
                    item.quantity,
                    item.fruit_id,
                    item.packaging_size
                ]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "Purchase recorded and stock updated."
        });

    } catch (error) {
        if (connection) await connection.rollback();

        res.status(400).json({
            message: error.message
        });

    } finally {
        if (connection) connection.release();
    }
});

// SALES
app.get("/api/sales", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT Sales.*, Vendors.vendor_name
            FROM Sales
            JOIN Vendors ON Sales.vendor_id = Vendors.vendor_id
            ORDER BY Sales.sale_id DESC
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/api/sales", async (req, res) => {
    let connection;

    try {
        const {
            vendor_id,
            sale_date,
            payment_method,
            amount_paid = 0,
            items
        } = req.body;

        if (!vendor_id || !sale_date || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Enter vendor, date and sale items."
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        let total = 0;

        for (const item of items) {
            const quantity = Number(item.quantity);
            const price = Number(item.unit_price);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0 ||
                !Number.isFinite(price) ||
                price < 0 ||
                !["Small", "Medium", "Large"].includes(item.packaging_size)
            ) {
                throw new Error(
                    "Check the sale quantities, prices and packaging sizes."
                );
            }

            const [rows] = await connection.query(
                `SELECT available_quantity FROM Stock
                 WHERE fruit_id=? AND packaging_size=? FOR UPDATE`,
                [item.fruit_id, item.packaging_size]
            );

            if (rows.length === 0 || rows[0].available_quantity < quantity) {
                throw new Error(
                    "Not enough stock available for one or more items."
                );
            }

            const [fruit] = await connection.query(
                "SELECT fruit_id FROM Fruits WHERE fruit_id=? AND status='Available'",
                [item.fruit_id]
            );

            if (fruit.length === 0) {
                throw new Error("Fruit is unavailable.");
            }

            total += quantity * price;
        }

        const paid = Number(amount_paid);

        if (!Number.isFinite(paid) || paid < 0 || paid > total) {
            throw new Error(
                "Amount paid must be between zero and the sale total."
            );
        }

        const paymentStatus = paid === total
            ? "PAID"
            : paid > 0 ? "PARTIALLY_PAID" : "UNPAID";

        const [sale] = await connection.query(
            `INSERT INTO Sales
            (vendor_id, sale_date, payment_status, payment_method, total_amount, amount_paid)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                vendor_id,
                sale_date,
                paymentStatus,
                payment_method || null,
                total,
                paid
            ]
        );

        for (const item of items) {
            await connection.query(
                `INSERT INTO Sales_Details
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
                `UPDATE Stock
                 SET available_quantity = available_quantity - ?
                 WHERE fruit_id=? AND packaging_size=?`,
                [
                    item.quantity,
                    item.fruit_id,
                    item.packaging_size
                ]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "Sale recorded and stock updated."
        });

    } catch (error) {
        if (connection) await connection.rollback();

        res.status(400).json({
            message: error.message
        });

    } finally {
        if (connection) connection.release();
    }
});

// ERROR HANDLER
app.use((error, req, res, next) => {
    console.error("Server error:", error);

    res.status(500).json({
        success: false,
        message: error.message || "Internal server error."
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Batloung Farm backend running on port ${PORT}`);
});

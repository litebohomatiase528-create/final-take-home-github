
import * as Purchase from "../models/purchaseModel.js";

export const getPurchases = async (req, res, next) => {
    try {
        res.json(await Purchase.getAllPurchases());
    } catch (error) {
        next(error);
    }
};

export const getPurchase = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid purchase ID." });
        }

        const details = await Purchase.getPurchaseDetails(id);

        if (!details.length) {
            return res.status(404).json({ message: "Purchase not found." });
        }

        res.json(details);
    } catch (error) {
        next(error);
    }
};

export const addPurchase = async (req, res, next) => {
    try {
        const { supplier_id, purchase_date, items } = req.body;

        if (!supplier_id || !purchase_date ||
            !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Supplier, purchase date and at least one item are required."
            });
        }

        const purchase = await Purchase.createPurchase(req.body);
        res.status(201).json({
            message: "Purchase recorded and stock updated successfully.",
            data: purchase
        });
    } catch (error) {
        next(error);
    }
};

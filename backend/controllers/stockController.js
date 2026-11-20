
import * as Stock from "../models/stockModel.js";

export const getStock = async (req, res, next) => {
    try {
        res.json(await Stock.getAllStock());
    } catch (error) {
        next(error);
    }
};

export const getFruitStock = async (req, res, next) => {
    try {
        const rows = await Stock.getStockByFruit(req.params.fruitId);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const getLowStock = async (req, res, next) => {
    try {
        const threshold = Number(req.query.threshold ?? 10);

        if (!Number.isInteger(threshold) || threshold < 0) {
            return res.status(400).json({ message: "Invalid stock threshold." });
        }

        res.json(await Stock.getLowStock(threshold));
    } catch (error) {
        next(error);
    }
};

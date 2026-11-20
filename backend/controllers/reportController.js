
import * as Report from "../models/reportModel.js";

// TOP FIVE FRUITS
export const topFruits = async (req, res) => {
    try {
        const result = await Report.getTopFruits();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

// SALES REVENUE
export const revenueReport = async (req, res) => {
    try {
        const start_date = req.query.start_date || req.query.startDate;
        const end_date = req.query.end_date || req.query.endDate;

        if (!start_date || !end_date || start_date > end_date) {
            return res.status(400).json({
                message: "Valid start date and end date are required."
            });
        }

        const result = await Report.getRevenueReport(
            start_date,
            end_date
        );

        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

// TOP PURCHASING VENDOR
export const topVendor = async (req, res) => {
    try {
        const result = await Report.getTopVendor();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

// CURRENT STOCK
export const currentStock = async (req, res) => {
    try {
        const result = await Report.getCurrentStock();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};

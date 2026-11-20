
import * as Fruit from "../models/fruitModel.js";

export const getFruits = async (req, res, next) => {
    try {
        res.json(await Fruit.getAllFruits());
    } catch (error) {
        next(error);
    }
};

export const getFruit = async (req, res, next) => {
    try {
        const fruit = await Fruit.getFruitById(req.params.id);

        if (!fruit) {
            return res.status(404).json({ message: "Fruit not found." });
        }

        res.json(fruit);
    } catch (error) {
        next(error);
    }
};

export const addFruit = async (req, res, next) => {
    try {
        const { fruit_name, description, status } = req.body;

        if (typeof fruit_name !== "string" || !fruit_name.trim()) {
            return res.status(400).json({ message: "Fruit name is required." });
        }

        if (status && !["Available", "Unavailable"].includes(status)) {
            return res.status(400).json({ message: "Invalid fruit status." });
        }

        const fruit = await Fruit.createFruit(req.body);
        res.status(201).json(fruit);
    } catch (error) {
        next(error);
    }
};

export const editFruit = async (req, res, next) => {
    try {
        const { fruit_name, status } = req.body;

        if (typeof fruit_name !== "string" || !fruit_name.trim()) {
            return res.status(400).json({ message: "Fruit name is required." });
        }

        if (!["Available", "Unavailable"].includes(status)) {
            return res.status(400).json({ message: "Invalid fruit status." });
        }

        const fruit = await Fruit.updateFruit(req.params.id, req.body);

        if (!fruit) {
            return res.status(404).json({ message: "Fruit not found." });
        }

        res.json(fruit);
    } catch (error) {
        next(error);
    }
};

export const removeFruit = async (req, res, next) => {
    try {
        const deleted = await Fruit.deleteFruit(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Fruit not found." });
        }

        res.json({ message: "Fruit deleted successfully." });
    } catch (error) {
        next(error);
    }
};


import express from "express";
import {
    getStock,
    getFruitStock,
    getLowStock
} from "../controllers/stockController.js";

const router = express.Router();

router.get("/", getStock);
router.get("/low-stock", getLowStock);
router.get("/fruit/:fruitId", getFruitStock);

export default router;

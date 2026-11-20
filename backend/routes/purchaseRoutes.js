
import express from "express";
import {
    getPurchases,
    getPurchase,
    addPurchase
} from "../controllers/purchaseController.js";

const router = express.Router();

router.get("/", getPurchases);
router.get("/:id", getPurchase);
router.post("/", addPurchase);

export default router;

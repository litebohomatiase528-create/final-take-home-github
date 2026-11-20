
import express from "express";
import {
    getSales,
    getSale,
    addSale
} from "../controllers/salesController.js";

const router = express.Router();

router.get("/", getSales);
router.get("/:id", getSale);
router.post("/", addSale);

export default router;

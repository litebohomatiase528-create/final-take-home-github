
import express from "express";

import {
    topFruits,
    revenueReport,
    topVendor,
    currentStock
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/top-fruits", topFruits);

router.get("/revenue", revenueReport);

router.get("/top-vendor", topVendor);

router.get("/stock", currentStock);

export default router;

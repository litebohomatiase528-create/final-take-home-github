
import express from "express";
import {
    getSuppliers,
    getSupplier,
    addSupplier,
    editSupplier,
    removeSupplier
} from "../controllers/supplierController.js";

const router = express.Router();

router.get("/", getSuppliers);
router.get("/:id", getSupplier);
router.post("/", addSupplier);
router.put("/:id", editSupplier);
router.delete("/:id", removeSupplier);

export default router;

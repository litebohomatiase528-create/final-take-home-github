
import express from "express";
import {
    getVendors,
    getVendor,
    addVendor,
    editVendor,
    removeVendor
} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/", getVendors);
router.get("/:id", getVendor);
router.post("/", addVendor);
router.put("/:id", editVendor);
router.delete("/:id", removeVendor);

export default router;

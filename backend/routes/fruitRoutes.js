
import express from "express";
import {
    getFruits,
    getFruit,
    addFruit,
    editFruit,
    removeFruit
} from "../controllers/fruitController.js";

const router = express.Router();

router.get("/", getFruits);
router.get("/:id", getFruit);
router.post("/", addFruit);
router.put("/:id", editFruit);
router.delete("/:id", removeFruit);

export default router;

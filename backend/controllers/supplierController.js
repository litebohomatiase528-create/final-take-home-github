
import * as Supplier from "../models/supplierModel.js";

export const getSuppliers = async (req, res, next) => {
    try {
        res.json(await Supplier.getAllSuppliers());
    } catch (error) {
        next(error);
    }
};

export const getSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.getSupplierById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found." });
        }

        res.json(supplier);
    } catch (error) {
        next(error);
    }
};

export const addSupplier = async (req, res, next) => {
    try {
        const { business_name, contact_person, phone, province, address } = req.body;

        if (![business_name, contact_person, phone, province, address]
            .every(value => typeof value === "string" && value.trim())) {
            return res.status(400).json({ message: "All supplier fields are required." });
        }

        const supplier = await Supplier.createSupplier(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        next(error);
    }
};

export const editSupplier = async (req, res, next) => {
    try {
        const { business_name, contact_person, phone, province, address } = req.body;

        if (![business_name, contact_person, phone, province, address]
            .every(value => typeof value === "string" && value.trim())) {
            return res.status(400).json({ message: "All supplier fields are required." });
        }

        const supplier = await Supplier.updateSupplier(req.params.id, req.body);

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found." });
        }

        res.json(supplier);
    } catch (error) {
        next(error);
    }
};

export const removeSupplier = async (req, res, next) => {
    try {
        const deleted = await Supplier.deleteSupplier(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Supplier not found." });
        }

        res.json({ message: "Supplier deleted successfully." });
    } catch (error) {
        next(error);
    }
};

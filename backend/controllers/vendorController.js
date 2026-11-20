
import * as Vendor from "../models/vendorModel.js";

export const getVendors = async (req, res, next) => {
    try {
        const search = req.query.search;

        const vendors = search
            ? await Vendor.searchVendors(search)
            : await Vendor.getAllVendors();

        res.json(vendors);
    } catch (error) {
        next(error);
    }
};

export const getVendor = async (req, res, next) => {
    try {
        const vendor = await Vendor.getVendorById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        res.json(vendor);
    } catch (error) {
        next(error);
    }
};

export const addVendor = async (req, res, next) => {
    try {
        const { vendor_name, phone_number, location, registration_date } = req.body;

        if (![vendor_name, phone_number, location, registration_date]
            .every(value => typeof value === "string" && value.trim())) {
            return res.status(400).json({ message: "All vendor fields are required." });
        }

        const vendor = await Vendor.createVendor(req.body);
        res.status(201).json(vendor);
    } catch (error) {
        next(error);
    }
};

export const editVendor = async (req, res, next) => {
    try {
        const { vendor_name, phone_number, location, registration_date } = req.body;

        if (![vendor_name, phone_number, location, registration_date]
            .every(value => typeof value === "string" && value.trim())) {
            return res.status(400).json({ message: "All vendor fields are required." });
        }

        const vendor = await Vendor.updateVendor(req.params.id, req.body);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        res.json(vendor);
    } catch (error) {
        next(error);
    }
};

export const removeVendor = async (req, res, next) => {
    try {
        const deleted = await Vendor.deleteVendor(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        res.json({ message: "Vendor deleted successfully." });
    } catch (error) {
        next(error);
    }
};


const errorMiddleware = (error, req, res, next) => {
    console.error("Backend error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            message: "This record already exists. Check the phone number or name."
        });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
            message: "The selected supplier, vendor or fruit does not exist."
        });
    }

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({
            message: "This record cannot be deleted because it is being used in another record."
        });
    }

    if (error.code === "ER_BAD_NULL_ERROR" ||
        error.code === "ER_CHECK_CONSTRAINT_VIOLATED" ||
        error.code === "ER_TRUNCATED_WRONG_VALUE") {
        return res.status(400).json({
            message: "Invalid or missing information supplied."
        });
    }

    const status = error.statusCode || 500;

    res.status(status).json({
        message: status === 500
            ? "An internal server error occurred."
            : error.message
    });
};

export default errorMiddleware;

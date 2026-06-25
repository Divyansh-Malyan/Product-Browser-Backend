import { fetchProducts } from "../models/productModel.js";

export const getProducts = async (req, res) => {
    try {
        // Read query parameters
        const requestedLimit = Number(req.query.limit);

        const limit =
            Number.isInteger(requestedLimit) && requestedLimit > 0
                ? Math.min(requestedLimit, 50)
                : 20;

        const cursor = req.query.cursor || null;
        const category = req.query.category?.trim() || null;

        // Validate Cursor
        if (cursor) {
            const parts = cursor.split("_");

            if (
                parts.length !== 2 ||
                isNaN(Date.parse(parts[0])) ||
                isNaN(Number(parts[1]))
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid cursor format",
                });
            }
        }

        const result = await fetchProducts({
            limit,
            cursor,
            category,
        });

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
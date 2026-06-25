import pool from "../config/db.js";

export const fetchProducts = async ({ limit, cursor, category }) => {

    let query = `
        SELECT
            id,
            name,
            category,
            price,
            created_at,
            updated_at
        FROM products
    `;

    const conditions = [];
    const values = [];

    // Category Filter
    if (category) {
        values.push(category);
        conditions.push(`category = $${values.length}`);
    }

    // Cursor Pagination
    if (cursor) {

        const [updatedAt, id] = cursor.split("_");

        const updatedAtIndex = values.length + 1;
        values.push(updatedAt);

        const idIndex = values.length + 1;
        values.push(Number(id));

        conditions.push(
            `(updated_at, id) < ($${updatedAtIndex}, $${idIndex})`
        );
    }

    // WHERE clause
    if (conditions.length > 0) {
        query += `
            WHERE ${conditions.join(" AND ")}
        `;
    }

    // Newest first
    query += `
        ORDER BY updated_at DESC, id DESC
    `;

    // Fetch one extra record
    values.push(limit + 1);

    query += `
        LIMIT $${values.length}
    `;

    const result = await pool.query(query, values);

    let products = result.rows;

    const hasMore = products.length > limit;

    if (hasMore) {
        products.pop();
    }

    let nextCursor = null;

    if (products.length > 0) {
        const lastProduct = products[products.length - 1];

        nextCursor =
            `${lastProduct.updated_at.toISOString()}_${lastProduct.id}`;
    }

    return {
        success: true,
        count: products.length,
        hasMore,
        nextCursor,
        products,
    };
};
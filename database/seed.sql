WITH generated_products AS (
    SELECT
        gs,

        'Product ' || gs AS name,

        (
            ARRAY[
                'Electronics',
                'Clothing',
                'Books',
                'Stationery',
                'Medical',
                'Sports',
                'Furniture',
                'Food',
                'Beauty',
                'Automobile'
            ]
        )[floor(random() * 10 + 1)] AS category,

        ROUND((random() * 10000 + 100)::numeric, 2) AS price,

        NOW() - (random() * interval '365 days') AS created_at

    FROM generate_series(1, 200000) AS gs
)

INSERT INTO products (
    name,
    category,
    price,
    created_at,
    updated_at
)

SELECT
    name,
    category,
    price,
    created_at,
    created_at + (random() * (NOW() - created_at))

FROM generated_products;
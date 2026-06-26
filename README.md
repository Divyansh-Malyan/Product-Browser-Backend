# Product Browser Backend

## Live Demo

### Frontend 

https://product-browser-frontend-rouge.vercel.app/

### Backend API

https://product-browser-backend-q8h4.onrender.com

---

## About

This project was built as part of the **CodeVector Backend Internship Assignment**.

The goal was to build a backend that can efficiently browse around **200,000 products**, filter them by category, and paginate through them while keeping pagination fast and consistent.

Instead of using traditional offset pagination, this project uses **cursor (keyset) pagination** to avoid duplicate or missing products when new products are added or updated while users are browsing.

A simple React frontend is also included as a bonus to demonstrate the API.

---

# Features

* Browse products (newest first)
* Filter products by category
* Cursor-based pagination
* Configurable page size (maximum 50)
* SQL schema script
* SQL seed script to generate approximately 200,000 products
* Responsive frontend (Bonus)

---

# Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL (Supabase)
* pg

### Frontend

* React
* Vite
* Axios

### Deployment

* Backend: Render
* Database: Supabase
* Frontend: Vercel

---

# How it Works

1. The client requests products from the backend.

2. The backend queries PostgreSQL using cursor pagination.

3. Products are returned ordered by:

```
updated_at DESC, id DESC
```

4. The response also includes:

* hasMore
* nextCursor

5. The frontend uses `nextCursor` to request the next page when the user clicks **Load More**.

---

# API

## GET /products

### Query Parameters

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| limit     | Number of products to return (default: 20, maximum: 50) |
| category  | Filter products by category                             |
| cursor    | Cursor received from the previous response              |

### Example Requests

```
GET /products

GET /products?limit=20

GET /products?category=Electronics

GET /products?cursor=<nextCursor>
```

### Success Response

```json
{
  "success": true,
  "count": 20,
  "hasMore": true,
  "nextCursor": "...",
  "products": [...]
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid cursor format"
}
```

---

# Database

Each product contains:

* id
* name
* category
* price
* created_at
* updated_at

Approximately **200,000 products** are generated using the included SQL seed script.

---

# Performance

To keep pagination fast, the following indexes are created:

```sql
CREATE INDEX idx_products_updated
ON products(updated_at DESC, id DESC);

CREATE INDEX idx_products_category_updated
ON products(category, updated_at DESC, id DESC);
```

Cursor pagination is implemented using:

```
(updated_at, id)
```

This allows PostgreSQL to efficiently continue from the last product of the previous page instead of scanning skipped rows like offset pagination.

---

# Project Structure

```
codevector-assignment-backend/

│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
│
├── package.json
└── README.md
```

---

# Setup Instructions

## Install dependencies

```bash
npm install
```

## Create database schema

```bash
npm run schema
```

## Seed the database

```bash
npm run seed
```

## Start the server

```bash
npm start
```

---

# Design Decisions

* Used PostgreSQL because it provides excellent support for indexing and cursor-based pagination.
* Used parameterized SQL queries to prevent SQL injection.
* Used MVC architecture to keep the project organized.
* Used SQL to generate the sample data instead of inserting products one by one for better performance.
* Used cursor pagination instead of offset pagination to keep pagination efficient and consistent while data changes.

---

# Future Improvements

With more time, I would add:

* Search by product name
* Sorting by different fields
* Automated tests
* Swagger/OpenAPI documentation
* Docker support
* Request logging and monitoring

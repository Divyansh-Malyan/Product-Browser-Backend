# Product Browser Backend

This project was built as part of the CodeVector Backend Internship assignment.

The goal was to build a backend that can efficiently browse around **200,000 products**, filter them by category, and paginate through them while keeping the results consistent even if new products are added or updated during browsing.

---

## Live API

**Render**

`https://product-browser-backend-q8h4.onrender.com`

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL (Supabase)
* pg
* Render

---

## Features

* Browse products (newest first)
* Filter products by category
* Cursor-based pagination
* Supports up to 50 products per request
* Seed script to generate around 200,000 products
* SQL schema included

---

## Why I used Cursor Pagination

Initially, I looked into offset pagination because it's simple to implement. After reading about the assignment requirements, I realized it wouldn't be the right choice.

With a large dataset, offset pagination becomes slower as the page number increases. It can also return duplicate or missing products if new records are added while a user is browsing.

To avoid those problems, I used **cursor (keyset) pagination** based on:

```text
(updated_at, id)
```

Using both fields keeps the ordering stable, even when multiple products have the same timestamp.

---

## Database

Each product contains:

* id
* name
* category
* price
* created_at
* updated_at

To keep the queries fast, I created indexes on:

```sql
(updated_at DESC, id DESC)
```

and

```sql
(category, updated_at DESC, id DESC)
```

These indexes help PostgreSQL quickly return the newest products and category-filtered products.

---

## API

### Get Products

```http
GET /products
```

### Query Parameters

| Parameter | Description                               |
| --------- | ----------------------------------------- |
| limit     | Number of products (default 20, max 50)   |
| category  | Filter by category                        |
| cursor    | Cursor returned from the previous request |

Example:

```http
GET /products?limit=20

GET /products?category=Electronics

GET /products?cursor=<nextCursor>
```

---

## Running the Project

Install dependencies

```bash
npm install
```

Create the database schema

```bash
npm run schema
```

Generate sample data

```bash
npm run seed
```

Start the server

```bash
npm start
```

---

## Project Structure

```text
src
│
├── config
├── controllers
├── models
├── routes
├── scripts
└── server.js
```

---

## If I had more time

A few things I'd add are:

* Search by product name
* Sorting by price
* Unit and integration tests
* Swagger API documentation
* Docker support
* Better request logging

---

## Bonus

I also built a small React frontend to test and demonstrate the API. It wasn't the main focus of the assignment, but it makes it easier to browse the products and verify the pagination.

---

## AI Usage

I used AI as a development assistant during the project. It helped me explore different approaches, review implementation ideas, and debug a few issues during development and deployment.

I made sure to understand every part of the solution before using it. I also tested the implementation myself and fixed issues that came up, especially around cursor pagination, SQL queries, and deployment.

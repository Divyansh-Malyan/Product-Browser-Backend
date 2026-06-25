import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSchema() {
    try {
        console.log("Running schema.sql...");

        const schemaPath = path.join(__dirname, "../../database/schema.sql");

        const sql = await fs.readFile(schemaPath, "utf-8");

        await pool.query(sql);

        console.log("Database schema created successfully!");

    } catch (error) {
        console.error("Failed to create schema");
        console.error(error);
    } finally {
        await pool.end();
    }
}

runSchema();
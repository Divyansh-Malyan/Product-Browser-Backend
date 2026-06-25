import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
    try {
        console.log("Running seed.sql...");

        const seedPath = path.join(__dirname, "../../database/seed.sql");

        const sql = await fs.readFile(seedPath, "utf-8");

        await pool.query(sql);

        console.log("200000 products inserted successfully!");

    } catch (error) {
        console.error("Failed to seed database");
        console.error(error);
    } finally {
        await pool.end();
    }
}

runSeed();
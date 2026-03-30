import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "..", "..");
export const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");
export const DB_PATH = path.join(ROOT_DIR, "database.sqlite");
export const PORT = Number(process.env.PORT || 3001);
export const JWT_SECRET = process.env.JWT_SECRET || "troque-esta-chave-em-producao";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

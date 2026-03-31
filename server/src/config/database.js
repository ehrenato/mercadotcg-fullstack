import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "..", "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "mercadotcg.sqlite");

export const db = new sqlite3.Database(dbPath);

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          lastID: this.lastID,
          changes: this.changes
        });
      }
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row ?? null);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows ?? []);
    });
  });
}

export async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      idioma TEXT NOT NULL,
      qualidade TEXT NOT NULL,
      extras TEXT NOT NULL,
      image_url TEXT,
      user_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  const existingProducts = await get(`SELECT COUNT(*) as total FROM products`);

  if (!existingProducts || existingProducts.total === 0) {
    await seedProducts();
  }
}

async function seedProducts() {
  await run(
    `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `,
    ["Loja Demo", "demo@mercadotcg.com", "123456"]
  ).catch(() => null);

  const demoUser = await get(`SELECT id FROM users WHERE email = ?`, [
    "demo@mercadotcg.com"
  ]);

  if (!demoUser) return;

  const products = [
    {
      title: "Charizard Holográfico",
      description: "Carta rara em ótimo estado para colecionadores.",
      price: 299.9,
      category: "Pokémon",
      image_url: "/uploads/sample-charizard.jpg"
    },
    {
      title: "Pikachu Edição Especial",
      description: "Carta promocional muito procurada.",
      price: 149.9,
      category: "Pokémon",
      image_url: "/uploads/sample-pikachu.jpg"
    },
    {
      title: "Deck Box Premium",
      description: "Acessório ideal para proteger sua coleção.",
      price: 59.9,
      category: "Acessórios",
      image_url: "/uploads/sample-deckbox.jpg"
    }
  ];

  for (const product of products) {
    await run(
      `
        INSERT INTO products (title, price, category, idioma, qualidade, extras, image_url, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        product.title,
        product.price,
        product.category,
        product.idioma,
        product.qualidade,
        product.extras,
        product.image_url,
        demoUser.id
      ]
    );
  }
}
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db } from "../config/database.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeImagePath(filePath) {
  if (!filePath) return null;
  return filePath.replace(/\\/g, "/");
}

router.get("/", (req, res) => {
  const { search = "", category = "", sellerId = "" } = req.query;

  let sql = `
    SELECT
      p.id,
      p.title,
      p.price,
      p.category,
      p.idioma,
      p.qualidade,
      p.extras,
      p.image_url,
      p.user_id,
      p.created_at,
      u.name as seller_name
    FROM products p
    LEFT JOIN users u ON u.id = p.user_id
    WHERE 1 = 1
  `;

  const params = [];

  if (search) {
    sql += ` AND p.title LIKE ? `;
    params.push(`%${search}%`);
  }

  if (category && category !== "Todos") {
    sql += ` AND p.category = ? `;
    params.push(category);
  }

  if (sellerId) {
    sql += ` AND p.user_id = ? `;
    params.push(Number(sellerId));
  }

  sql += ` ORDER BY p.created_at DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar produtos." });
    }

    const formatted = rows.map((product) => ({
      ...product,
      image_url: normalizeImagePath(product.image_url),
    }));

    res.json(formatted);
  });
});

router.get("/mine", requireAuth, (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.title,
      p.price,
      p.category,
      p.idioma,
      p.qualidade,
      p.extras,
      p.image_url,
      p.user_id,
      p.created_at
    FROM products p
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `;

  db.all(sql, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar seus anúncios." });
    }

    const formatted = rows.map((product) => ({
      ...product,
      image_url: normalizeImagePath(product.image_url),
    }));

    res.json(formatted);
  });
});

router.get("/:id", (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.title,
      p.price,
      p.category,
      p.idioma,
      p.qualidade,
      p.extras,
      p.image_url,
      p.user_id,
      p.created_at,
      u.name as seller_name
    FROM products p
    LEFT JOIN users u ON u.id = p.user_id
    WHERE p.id = ?
  `;

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar produto." });
    }

    if (!row) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.json({
      ...row,
      image_url: normalizeImagePath(row.image_url),
    });
  });
});

router.post("/", requireAuth, upload.single("image"), (req, res) => {
  const { title, price, category, idioma, qualidade, extras } = req.body;

  if (!title || !price || !category || !idioma || !qualidade) {
    return res.status(400).json({
      message: "Título, preço, categoria, idioma e qualidade são obrigatórios.",
    });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO products (
      title,
      price,
      category,
      idioma,
      qualidade,
      extras,
      image_url,
      user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      title,
      Number(price),
      category,
      idioma,
      qualidade,
      extras ?? "",
      imageUrl,
      req.user.id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Erro ao criar anúncio." });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        price: Number(price),
        category,
        idioma,
        qualidade,
        extras: extras ?? "",
        image_url: normalizeImagePath(imageUrl),
        user_id: req.user.id,
      });
    }
  );
});

router.put("/:id", requireAuth, upload.single("image"), (req, res) => {
  const { title, price, category, idioma, qualidade, extras } = req.body;
  const productId = Number(req.params.id);

  db.get(`SELECT * FROM products WHERE id = ?`, [productId], (findErr, product) => {
    if (findErr) {
      return res.status(500).json({ message: "Erro ao buscar anúncio." });
    }

    if (!product) {
      return res.status(404).json({ message: "Anúncio não encontrado." });
    }

    if (product.user_id !== req.user.id) {
      return res.status(403).json({ message: "Sem permissão para editar este anúncio." });
    }

    const nextTitle = title ?? product.title;
    const nextPrice = price ?? product.price;
    const nextCategory = category ?? product.category;
    const nextIdioma = idioma ?? product.idioma;
    const nextQualidade = qualidade ?? product.qualidade;
    const nextExtras = extras ?? product.extras ?? "";

    let nextImageUrl = product.image_url;

    if (req.file) {
      if (product.image_url && product.image_url.startsWith("/uploads/")) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          product.image_url.replace(/^\//, "")
        );

        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch {
            // ignora erro de remoção
          }
        }
      }

      nextImageUrl = `/uploads/${req.file.filename}`;
    }

    const sql = `
      UPDATE products
      SET
        title = ?,
        price = ?,
        category = ?,
        idioma = ?,
        qualidade = ?,
        extras = ?,
        image_url = ?
      WHERE id = ?
    `;

    db.run(
      sql,
      [
        nextTitle,
        Number(nextPrice),
        nextCategory,
        nextIdioma,
        nextQualidade,
        nextExtras,
        nextImageUrl,
        productId,
      ],
      function (updateErr) {
        if (updateErr) {
          return res.status(500).json({ message: "Erro ao atualizar anúncio." });
        }

        res.json({
          id: productId,
          title: nextTitle,
          price: Number(nextPrice),
          category: nextCategory,
          idioma: nextIdioma,
          qualidade: nextQualidade,
          extras: nextExtras,
          image_url: normalizeImagePath(nextImageUrl),
          user_id: req.user.id,
        });
      }
    );
  });
});

router.delete("/:id", requireAuth, (req, res) => {
  const productId = Number(req.params.id);

  db.get(`SELECT * FROM products WHERE id = ?`, [productId], (findErr, product) => {
    if (findErr) {
      return res.status(500).json({ message: "Erro ao buscar anúncio." });
    }

    if (!product) {
      return res.status(404).json({ message: "Anúncio não encontrado." });
    }

    if (product.user_id !== req.user.id) {
      return res.status(403).json({ message: "Sem permissão para excluir este anúncio." });
    }

    db.run(`DELETE FROM products WHERE id = ?`, [productId], function (deleteErr) {
      if (deleteErr) {
        return res.status(500).json({ message: "Erro ao excluir anúncio." });
      }

      if (product.image_url && product.image_url.startsWith("/uploads/")) {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          product.image_url.replace(/^\//, "")
        );

        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch {
            // ignora erro de remoção
          }
        }
      }

      res.json({ message: "Anúncio excluído com sucesso." });
    });
  });
});

export default router;
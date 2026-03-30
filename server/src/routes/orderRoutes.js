import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { run, all, get } from "../config/database.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await all(
      `
        SELECT id, total, created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.json(orders);
  } catch (error) {
    console.error("get orders error:", error);
    return res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Itens do pedido são obrigatórios." });
    }

    let total = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await get(
        "SELECT id, price FROM products WHERE id = ?",
        [item.productId]
      );

      if (!product) {
        return res.status(404).json({
          message: `Produto ${item.productId} não encontrado.`
        });
      }

      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(product.price);

      resolvedItems.push({
        productId: product.id,
        quantity,
        unitPrice
      });

      total += unitPrice * quantity;
    }

    const orderResult = await run(
      "INSERT INTO orders (user_id, total) VALUES (?, ?)",
      [req.user.id, total]
    );

    for (const item of resolvedItems) {
      await run(
        `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES (?, ?, ?, ?)
        `,
        [orderResult.lastID, item.productId, item.quantity, item.unitPrice]
      );
    }

    return res.status(201).json({
      message: "Pedido criado com sucesso.",
      orderId: orderResult.lastID
    });
  } catch (error) {
    console.error("create order error:", error);
    return res.status(500).json({ message: "Erro ao criar pedido." });
  }
});

export default router;
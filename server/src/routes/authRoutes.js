import express from "express";
import bcrypt from "bcryptjs";
import { run, get } from "../config/database.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
    }

    const existingUser = await get(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return res.status(409).json({ message: "Este email já está cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    const user = {
      id: result.lastID,
      name,
      email
    };

    const token = signToken({ sub: user.id });

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({ message: "Erro ao registrar usuário." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    const user = await get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = signToken({ sub: user.id });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: "Erro ao fazer login." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

export default router;
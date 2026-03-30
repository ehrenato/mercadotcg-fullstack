import { get } from "../config/database.js";
import { verifyToken } from "../utils/jwt.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não informado." });
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    const user = await get(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [payload.sub]
    );

    if (!user) {
      return res.status(401).json({ message: "Usuário do token não encontrado." });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
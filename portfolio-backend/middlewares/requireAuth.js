const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso no autorizado: Token no provisto" });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("❌ ERROR CRÍTICO: JWT_SECRET no está definido en las variables de entorno.");
    return res.status(500).json({ error: "Error de configuración interna del servidor" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { conectarDB } = require("./config/db");
const { globalApiLimiter } = require("./middlewares/rateLimiters");

// ====================================================================
// VALIDACIÓN CRÍTICA DE VARIABLES DE ENTORNO EN ARRANQUE (Punto 1)
// ====================================================================
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 8) {
  console.error("❌ ERROR CRÍTICO DE SEGURIDAD: 'JWT_SECRET' no está configurada o es demasiado débil.");
  console.error("   Por favor, define una clave segura en tu archivo .env antes de iniciar el servidor.");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR CRÍTICO: 'MONGO_URI' no está configurada en las variables de entorno.");
  process.exit(1);
}

const app = express();

// ====================================================================
// SEGURIDAD DE CABECERAS CON HELMET (Punto 4)
// ====================================================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.cloudinary.com", "blob:"],
        connectSrc: [
          "'self'",
          "https://res.cloudinary.com",
          ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map((u) => u.trim()) : []),
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    xContentTypeOptions: true,
    xDnsPrefetchControl: { allow: false },
    xFrameOptions: { action: "deny" },
  })
);

// ====================================================================
// CONFIGURACIÓN DE CORS
// ====================================================================
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map((o) => o.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (herramientas locales, scripts, Render health checks)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.some((ao) => origin.startsWith(ao)) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error("No permitido por CORS"));
    },
    credentials: true,
  })
);

// ====================================================================
// LÍMITE DE PAYLOAD REALISTA CONTRA DoS / ABUSO DE MEMORIA (Punto 8)
// ====================================================================
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

// ====================================================================
// RATE LIMITING GLOBAL (Punto 3)
// ====================================================================
app.use("/api", globalApiLimiter);

// Ruta de estado / bienvenida
app.get("/api", (req, res) => {
  res.json({
    mensaje: "API del Portfolio funcionando correctamente 🚀",
    recursos: [
      "/api/perfil",
      "/api/proyectos",
      "/api/experiencia",
      "/api/educacion",
      "/api/skills",
      "/api/auth",
      "/api/contacto",
      "/api/visitas",
    ],
  });
});

// Rutas de la API (Arquitectura MVC)
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/perfil", require("./routes/perfil.routes"));
app.use("/api/proyectos", require("./routes/proyectos.routes"));
app.use("/api/experiencia", require("./routes/experiencia.routes"));
app.use("/api/educacion", require("./routes/educacion.routes"));
app.use("/api/skills", require("./routes/skills.routes"));
app.use("/api/visitas", require("./routes/visitas.routes"));
app.use("/api/contacto", require("./routes/contacto.routes"));
app.use("/api/upload", require("./routes/upload.routes"));

const PORT = process.env.PORT || 4000;

// Conectar a MongoDB y levantar servidor
conectarDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Error iniciando el servidor:", err);
  });

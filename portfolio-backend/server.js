require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { conectarDB } = require("./config/db");

const app = express();

// Middlewares globales
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map((o) => o.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (herramientas locales, scripts, Render health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.some((ao) => origin.startsWith(ao)) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error("No permitido por CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

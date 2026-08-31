const rateLimit = require("express-rate-limit");

// Limitador estricto para inicio de sesión y registro (Protección contra Fuerza Bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiados intentos de acceso desde esta IP. Por seguridad, inténtalo de nuevo en 15 minutos.",
  },
});

// Limitador para formulario de contacto (Protección contra Spam y consumo de API Resend)
const contactoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Máximo 5 mensajes por hora por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Has alcanzado el límite de mensajes de contacto por hora. Por favor, intenta de nuevo más tarde.",
  },
});

// Limitador global general de la API (Protección contra Denial of Service / Scrapers)
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // Máximo 300 peticiones cada 15 min por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas peticiones al servidor. Por favor, disminuye la frecuencia de solicitudes.",
  },
});

module.exports = {
  loginLimiter,
  contactoLimiter,
  globalApiLimiter,
};

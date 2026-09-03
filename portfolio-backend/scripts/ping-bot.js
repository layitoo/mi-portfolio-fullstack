/**
 * Bot Keep-Alive Externo Independiente
 * =====================================
 * Uso desde tu computadora o un servidor externo:
 *   node scripts/ping-bot.js https://tu-portfolio-backend.onrender.com
 *   node scripts/ping-bot.js https://tu-portfolio-backend.onrender.com 10
 */

const targetArg = process.argv[2] || process.env.SERVER_URL || "http://localhost:4000";
const intervalMinutos = Number(process.argv[3]) || Number(process.env.PING_INTERVAL_MINUTES) || 10;
const intervalMs = intervalMinutos * 60 * 1000;

const baseUrl = targetArg.replace(/\/$/, "");
const pingUrl = baseUrl.endsWith("/api/ping") ? baseUrl : `${baseUrl}/api/ping`;

console.log("==================================================");
console.log("🤖 BOT KEEP-ALIVE PARA RENDER INICIADO");
console.log(`🎯 URL Destino: ${pingUrl}`);
console.log(`⏱️  Frecuencia : Cada ${intervalMinutos} minutos`);
console.log("==================================================");

async function ejecutarPing() {
  const hora = new Date().toLocaleTimeString();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const inicio = Date.now();
    const res = await fetch(pingUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Standalone-KeepAlive-Bot/1.0" },
    });
    clearTimeout(timeout);
    const latencia = Date.now() - inicio;

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      console.log(`[${hora}] ✅ Ping exitoso (${res.status} OK) en ${latencia}ms | Servidor Activo ⚡`);
    } else {
      console.warn(`[${hora}] ⚠️ Servidor respondió con estado ${res.status}: ${res.statusText}`);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      console.error(`[${hora}] ❌ Timeout: El servidor tardó más de 15 segundos en responder.`);
    } else {
      console.error(`[${hora}] ❌ Error conectando al servidor: ${err.message}`);
    }
  }
}

// Ejecutar ping inmediato al arrancar
ejecutarPing();

// Programar ejecución continua
setInterval(ejecutarPing, intervalMs);

/**
 * Servicio Keep-Alive Bot
 * -----------------------
 * Evita que el servidor en Render (capa gratuita) entre en suspensión tras 15 minutos de inactividad,
 * enviando una petición HTTP GET periódica a su propio endpoint /api/ping cada 10 minutos.
 */

function iniciarKeepAliveBot() {
  // Render inyecta automáticamente RENDER_EXTERNAL_URL en el entorno de producción
  const urlServidor =
    process.env.SERVER_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    `http://localhost:${process.env.PORT || 4000}`;

  const intervalMinutos = Number(process.env.PING_INTERVAL_MINUTES) || 10;
  const intervalMs = intervalMinutos * 60 * 1000;
  const pingUrl = `${urlServidor.replace(/\/$/, "")}/api/ping`;

  console.log(`🤖 [Keep-Alive Bot] Iniciado para mantener despierto el servidor en Render.`);
  console.log(`   Destino: ${pingUrl}`);
  console.log(`   Frecuencia: Cada ${intervalMinutos} minutos.`);

  async function ejecutarPing() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(pingUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "Portfolio-KeepAlive-Bot/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const uptimeMin = Math.floor((data.uptimeSegundos || process.uptime()) / 60);
        console.log(
          `⚡ [Keep-Alive Bot] Ping exitoso (${res.status} OK) | Servidor despierto | Uptime: ${uptimeMin} min.`
        );
      } else {
        console.warn(`⚠️ [Keep-Alive Bot] Ping respondió con status ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn(`⚠️ [Keep-Alive Bot] Timeout al intentar hacer ping a ${pingUrl} (más de 15s).`);
      } else {
        console.warn(`⚠️ [Keep-Alive Bot] No se pudo enviar el ping: ${err.message}`);
      }
    }
  }

  // Primer ping tras 25 segundos del arranque para validar funcionamiento
  const timeoutInicial = setTimeout(ejecutarPing, 25000);

  // Intervalo recurrente cada X minutos
  const intervalId = setInterval(ejecutarPing, intervalMs);

  if (intervalId.unref) intervalId.unref();
  if (timeoutInicial.unref) timeoutInicial.unref();

  return { intervalId, timeoutInicial, pingUrl };
}

module.exports = { iniciarKeepAliveBot };

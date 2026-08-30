// Servicio de envío de emails (Brevo)

exports.enviarEmailVerificacion = async (email, token) => {
  const urlVerificacion = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verificar-cuenta?token=${token}`;
  
  if (process.env.BREVO_API_KEY) {
    try {
      // Envío real a través de Brevo REST API
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Portfolio Admin", email: "no-reply@miportfolio.com" },
          to: [{ email }],
          subject: "Confirmá tu cuenta de Administrador",
          htmlContent: `<p>Hacé clic acá para confirmar tu cuenta: <a href="${urlVerificacion}">${urlVerificacion}</a></p>`,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error enviando email con Brevo:", error.message);
    }
  }

  // Log en desarrollo para poder probar sin cuenta de Brevo aún
  console.log("--------------------------------------------------");
  console.log(`📧 [SIMULACIÓN EMAIL BREVO] Para: ${email}`);
  console.log(`🔗 Enlace de confirmación: ${urlVerificacion}`);
  console.log("--------------------------------------------------");
  return true;
};

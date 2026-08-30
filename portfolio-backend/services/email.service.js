// Servicio de envío de emails (Brevo / Nodemailer)

exports.enviarEmailVerificacion = async (email, token) => {
  const urlVerificacion = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verificar-cuenta?token=${token}`;
  
  if (process.env.BREVO_API_KEY) {
    try {
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

  console.log("--------------------------------------------------");
  console.log(`📧 [SIMULACIÓN EMAIL BREVO] Para: ${email}`);
  console.log(`🔗 Enlace de confirmación: ${urlVerificacion}`);
  console.log("--------------------------------------------------");
  return true;
};

exports.enviarMensajeContacto = async ({ nombre, email, mensaje }) => {
  const destinatario = process.env.ADMIN_EMAIL || "lalandaleandro@gmail.com";

  if (process.env.BREVO_API_KEY) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Portfolio Contacto", email: "contacto@miportfolio.com" },
          to: [{ email: destinatario }],
          replyTo: { email, name: nombre },
          subject: `📬 Nuevo mensaje de contacto de ${nombre}`,
          htmlContent: `
            <h2>Has recibido un nuevo mensaje desde tu Portfolio Web</h2>
            <p><strong>De:</strong> ${nombre} (${email})</p>
            <p><strong>Mensaje:</strong></p>
            <blockquote style="background:#f4f4f5;padding:12px;border-left:4px solid #000;">${mensaje}</blockquote>
          `,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error enviando email de contacto con Brevo:", error.message);
    }
  }

  // Fallback / Desarrollo local
  console.log("==================================================");
  console.log("📬 [NUEVO MENSAJE DE CONTACTO RECIBIDO]");
  console.log(`👤 Nombre: ${nombre}`);
  console.log(`📧 Email: ${email}`);
  console.log(`💬 Mensaje: ${mensaje}`);
  console.log(`📥 Destinatario: ${destinatario}`);
  console.log("==================================================");
  return true;
};

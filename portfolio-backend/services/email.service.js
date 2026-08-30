const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Envía un correo de verificación o confirmación
 */
exports.enviarEmailVerificacion = async (email, token) => {
  const urlVerificacion = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verificar-cuenta?token=${token}`;
  
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: "Portfolio Admin <onboarding@resend.dev>",
        to: [email],
        subject: "Confirmá tu cuenta de Administrador",
        html: `
          <div style="font-family: sans-serif; background: #0c0c0e; color: #fff; padding: 24px; border-radius: 12px;">
            <h2 style="color: #fff;">Confirmación de Cuenta</h2>
            <p style="color: #a1a1aa;">Hacé clic en el siguiente enlace para verificar tu cuenta:</p>
            <p><a href="${urlVerificacion}" style="color: #60a5fa; text-decoration: underline;">${urlVerificacion}</a></p>
          </div>
        `,
      });
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error("Error enviando email de verificación con Resend:", error.message);
    }
  }

  console.log("--------------------------------------------------");
  console.log(`📧 [SIMULACIÓN EMAIL] Para: ${email}`);
  console.log(`🔗 Enlace de confirmación: ${urlVerificacion}`);
  console.log("--------------------------------------------------");
  return true;
};

/**
 * Envía el mensaje de contacto recibido desde el frontend a tu Gmail real
 */
exports.enviarMensajeContacto = async ({ nombre, email, mensaje }) => {
  const destinatario = process.env.ADMIN_EMAIL || "lalandaleandro@gmail.com";

  if (resend) {
    const { data, error } = await resend.emails.send({
      from: "Portfolio Web <onboarding@resend.dev>",
      to: [destinatario],
      reply_to: email,
      subject: `📬 Nuevo mensaje de ${nombre} - Portfolio Web`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 24px; }
            .card { max-width: 580px; margin: 0 auto; background: #121216; border: 1px solid #27272a; border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
            .tag { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #a1a1aa; margin-bottom: 20px; }
            h1 { font-size: 22px; font-weight: 700; margin: 0 0 20px 0; color: #ffffff; letter-spacing: -0.5px; }
            .item { margin-bottom: 18px; }
            .label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #71717a; letter-spacing: 0.5px; margin-bottom: 6px; }
            .value { font-size: 15px; color: #f4f4f5; font-weight: 500; }
            .box { background: #000000; border: 1px solid #27272a; border-radius: 14px; padding: 18px; font-size: 14px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap; margin-top: 8px; }
            .hint { font-size: 13px; color: #a1a1aa; margin-top: 24px; padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: 10px; border-left: 3px solid #ffffff; }
            .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #27272a; font-size: 11px; color: #52525b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="tag">Portfolio Web • Contacto</div>
            <h1>¡Nuevo mensaje recibido!</h1>
            
            <div class="item">
              <div class="label">Remitente</div>
              <div class="value"><strong>${nombre}</strong> &lt;<a href="mailto:${email}" style="color: #ffffff; text-decoration: underline;">${email}</a>&gt;</div>
            </div>

            <div class="item">
              <div class="label">Mensaje</div>
              <div class="box">${mensaje}</div>
            </div>

            <div class="hint">
              💡 <strong>Tip:</strong> Puedes responder directamente a este email en tu Gmail para contestarle a <strong>${nombre}</strong>.
            </div>

            <div class="footer">
              Enviado automáticamente desde el formulario de contacto de tu Portfolio Web.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error enviando email con Resend:", error);
      throw new Error(error.message || "Error al enviar correo con Resend");
    }

    return data;
  }

  // Fallback desarrollo local sin API Key
  console.log("==================================================");
  console.log("📬 [SIMULACIÓN LOCAL - MENSAJE DE CONTACTO]");
  console.log(`👤 Nombre: ${nombre}`);
  console.log(`📧 Email: ${email}`);
  console.log(`💬 Mensaje: ${mensaje}`);
  console.log(`📥 Destinatario: ${destinatario}`);
  console.log("==================================================");
  return { id: "simulacion_local" };
};

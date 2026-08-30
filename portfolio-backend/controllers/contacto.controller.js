const EmailService = require("../services/email.service");

exports.enviar = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    await EmailService.enviarMensajeContacto({ nombre, email, mensaje });
    res.json({ mensaje: "¡Tu mensaje fue enviado con éxito! Te responderé a la brevedad." });
  } catch (error) {
    res.status(500).json({ error: "Error al enviar el mensaje", detalle: error.message });
  }
};

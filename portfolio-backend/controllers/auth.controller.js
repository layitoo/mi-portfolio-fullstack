const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UsuariosModel = require("../models/usuarios.model");

exports.registrar = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ ERROR CRÍTICO: JWT_SECRET no está configurada.");
      return res.status(500).json({ error: "Error de configuración del servidor" });
    }

    const existente = await UsuariosModel.obtenerPorEmail(email);
    if (existente) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await UsuariosModel.crear({
      email,
      passwordHash,
      rol: "admin",
      cuentaVerificada: true,
    });

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      mensaje: "Usuario admin registrado con éxito",
      token,
      usuario: { id: usuario._id, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario", detalle: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ ERROR CRÍTICO: JWT_SECRET no está configurada.");
      return res.status(500).json({ error: "Error de configuración del servidor" });
    }

    const usuario = await UsuariosModel.obtenerPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    const esValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!esValida) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: { id: usuario._id, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el login", detalle: error.message });
  }
};

exports.perfil = async (req, res) => {
  try {
    const usuario = await UsuariosModel.obtenerPorId(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ id: usuario._id, email: usuario.email, rol: usuario.rol });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario", detalle: error.message });
  }
};

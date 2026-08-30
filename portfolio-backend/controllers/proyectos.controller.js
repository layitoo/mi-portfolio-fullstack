const ProyectosModel = require("../models/proyectos.model");
const ProyectosService = require("../services/proyectos.service");

exports.listar = async (req, res) => {
  try {
    const proyectos = await ProyectosModel.obtenerTodos();
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener proyectos", detalle: error.message });
  }
};

exports.obtenerUno = async (req, res) => {
  try {
    const proyecto = await ProyectosModel.obtenerPorId(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.json(proyecto);
  } catch (error) {
    res.status(400).json({ error: "ID inválido o error de consulta", detalle: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = await ProyectosModel.crear(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el proyecto", detalle: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    await ProyectosModel.actualizar(req.params.id, req.body);
    res.json({ mensaje: "Proyecto actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar", detalle: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await ProyectosModel.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar", detalle: error.message });
  }
};

// Servicio con regla de negocio: Máximo 3 proyectos destacados
exports.destacar = async (req, res) => {
  try {
    await ProyectosService.destacar(req.params.id);
    res.json({ mensaje: "Proyecto destacado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Subida de imagen con Multer + Cloudinary
exports.subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ningún archivo de imagen" });
    }

    const imagenUrl = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    await ProyectosModel.actualizar(req.params.id, { imagenUrl });

    res.json({ mensaje: "Imagen subida con éxito", imagenUrl });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la imagen", detalle: error.message });
  }
};

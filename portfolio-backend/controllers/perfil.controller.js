const PerfilModel = require("../models/perfil.model");
const { GridFSBucket } = require("mongodb");
const { getDB } = require("../config/db");
const { Readable } = require("stream");
const path = require("path");
const fs = require("fs");

// Reto 6: Caché en memoria con TTL de 5 minutos
let cachePerfil = null;
let cacheTimestamp = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

exports.obtener = async (req, res) => {
  try {
    const ahora = Date.now();
    if (cachePerfil && cacheTimestamp && ahora - cacheTimestamp < CACHE_TTL_MS) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cachePerfil);
    }

    const perfil = await PerfilModel.obtener();
    cachePerfil = perfil || {};
    cacheTimestamp = ahora;

    res.setHeader("X-Cache", "MISS");
    res.json(cachePerfil);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil", detalle: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const perfilActualizado = await PerfilModel.actualizar(req.body);
    
    // Invalidación y actualización inmediata de la caché
    cachePerfil = perfilActualizado;
    cacheTimestamp = Date.now();

    res.json(perfilActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar perfil", detalle: error.message });
  }
};

// Subir y almacenar CV en formato PDF dentro de MongoDB GridFS
exports.subirCv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ningún archivo de CV o no es un PDF válido" });
    }

    const db = getDB();
    const bucket = new GridFSBucket(db, { bucketName: "cvFiles" });

    // Limpiar CVs previos para no acumular archivos huérfanos
    try {
      const archivosExistentes = await bucket.find({}).toArray();
      for (const arch of archivosExistentes) {
        await bucket.delete(arch._id).catch(() => null);
      }
    } catch (e) {
      console.warn("Aviso al depurar archivos antiguos de CV en GridFS:", e.message);
    }

    // Subir el nuevo archivo PDF a GridFS
    const nombreLimpio = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uploadStream = bucket.openUploadStream(nombreLimpio, {
      contentType: "application/pdf",
      metadata: {
        nombreOriginal: req.file.originalname,
        tamano: req.file.size,
        subidoEn: new Date().toISOString(),
      },
    });

    const readableStream = Readable.from(req.file.buffer);

    await new Promise((resolve, reject) => {
      readableStream
        .pipe(uploadStream)
        .on("error", reject)
        .on("finish", resolve);
    });

    const cvInfo = {
      nombreOriginal: req.file.originalname,
      tamano: req.file.size,
      mimetype: "application/pdf",
      actualizadoEn: new Date().toISOString(),
      archivoId: uploadStream.id,
    };

    // Actualizar el perfil en la base de datos con la ruta del CV y metadatos
    const perfilActual = (await PerfilModel.obtener()) || {};
    const redesActualizadas = {
      ...(perfilActual.redes || {}),
      cv: "/api/perfil/cv",
    };

    const perfilActualizado = await PerfilModel.actualizar({
      ...perfilActual,
      redes: redesActualizadas,
      cvInfo,
    });

    // Invalida y sincroniza la caché
    cachePerfil = perfilActualizado;
    cacheTimestamp = Date.now();

    res.json({
      mensaje: "¡Currículum Vitae (PDF) subido y actualizado con éxito! 📄",
      url: "/api/perfil/cv",
      cvInfo,
      perfil: perfilActualizado,
    });
  } catch (error) {
    console.error("Error al subir CV:", error);
    res.status(500).json({ error: "Error al guardar el CV en el servidor", detalle: error.message });
  }
};

// Descargar o visualizar el CV (Público)
exports.descargarCv = async (req, res) => {
  try {
    const db = getDB();
    const bucket = new GridFSBucket(db, { bucketName: "cvFiles" });

    const archivos = await bucket.find({}).sort({ uploadDate: -1 }).limit(1).toArray();

    if (!archivos || archivos.length === 0) {
      // Fallback: verificar si existe el CV estático por defecto en el sistema
      const fallbackLocal = path.resolve(__dirname, "../../portfolio-frontend/public/LeandroLalandaCV.pdf");
      if (fs.existsSync(fallbackLocal)) {
        res.setHeader("Content-Type", "application/pdf");
        if (req.query.download === "true" || req.query.download === "1") {
          res.setHeader("Content-Disposition", 'attachment; filename="LeandroLalandaCV.pdf"');
        } else {
          res.setHeader("Content-Disposition", 'inline; filename="LeandroLalandaCV.pdf"');
        }
        return fs.createReadStream(fallbackLocal).pipe(res);
      }

      return res.status(404).json({ error: "No hay ningún CV disponible actualmente" });
    }

    const archivo = archivos[0];
    const nombreDescarga = archivo.metadata?.nombreOriginal || archivo.filename || "LeandroLalandaCV.pdf";
    const nombreCodificado = encodeURIComponent(nombreDescarga);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", archivo.length);

    // Si viene ?download=true, fuerza la descarga directa en el navegador
    if (req.query.download === "true" || req.query.download === "1") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreDescarga.replace(/[^\x20-\x7E]/g, "_")}"; filename*=UTF-8''${nombreCodificado}`
      );
    } else {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${nombreDescarga.replace(/[^\x20-\x7E]/g, "_")}"; filename*=UTF-8''${nombreCodificado}`
      );
    }

    bucket.openDownloadStream(archivo._id).pipe(res);
  } catch (error) {
    console.error("Error al descargar CV:", error);
    res.status(500).json({ error: "Error al obtener el archivo de CV", detalle: error.message });
  }
};

// Eliminar CV personalizado y restaurar configuración predeterminada
exports.eliminarCv = async (req, res) => {
  try {
    const db = getDB();
    const bucket = new GridFSBucket(db, { bucketName: "cvFiles" });

    const archivos = await bucket.find({}).toArray();
    for (const arch of archivos) {
      await bucket.delete(arch._id).catch(() => null);
    }

    const perfilActual = (await PerfilModel.obtener()) || {};
    const redes = { ...(perfilActual.redes || {}) };
    delete redes.cv;

    const perfilActualizado = await PerfilModel.actualizar({
      ...perfilActual,
      redes,
      cvInfo: null,
    });

    cachePerfil = perfilActualizado;
    cacheTimestamp = Date.now();

    res.json({
      mensaje: "CV personalizado eliminado con éxito. Se restableció el CV predeterminado.",
      perfil: perfilActualizado,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el CV", detalle: error.message });
  }
};


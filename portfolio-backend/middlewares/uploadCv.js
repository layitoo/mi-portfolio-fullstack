const multer = require("multer");

// Usamos almacenamiento en memoria para luego subir el buffer directamente a MongoDB GridFS
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const esPdfMime = file.mimetype === "application/pdf";
  const esPdfExt = file.originalname.toLowerCase().endsWith(".pdf");

  if (esPdfMime || esPdfExt) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos en formato PDF (.pdf)"), false);
  }
};

const uploadCv = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // Límite de 25MB para documentos PDF
  },
  fileFilter,
});

module.exports = uploadCv;

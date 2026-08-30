const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "portfolio",
      allowed_formats: ["jpg", "png", "webp", "jpeg"],
    },
  });
} else {
  // Almacenamiento en memoria como fallback si aún no configuraron Cloudinary
  storage = multer.memoryStorage();
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de imagen (jpg, png, webp)"), false);
  }
};

module.exports = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Máximo 3MB
  fileFilter,
});

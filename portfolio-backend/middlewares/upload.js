const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "portfolio",
      allowed_formats: ["jpg", "png", "webp", "jpeg", "svg", "gif"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });
} else {
  // Almacenamiento en memoria como fallback si no se configuraron variables
  storage = multer.memoryStorage();
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de imagen (jpg, png, webp, jpeg, svg, gif)"), false);
  }
};

module.exports = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Máximo 25MB
  fileFilter,
});


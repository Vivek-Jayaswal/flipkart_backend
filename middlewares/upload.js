const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * All upload rules in one place
 */
const UPLOAD_CONFIG = {
  logo: {
    folder: "logos",
    maxCount: 1,
  },

  // category: {
  //   folder: "categories",
  //   maxCount: 1,
  // },

  thumbnail: {
    folder: "products",
    maxCount: 1,
  },

  gallery: {
    folder: "products",
    maxCount: 10,
  },

  variantImages: {
    folder: "variants",
    maxCount: 10,
  },
};

/**
 * Dynamic Storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("File fieldname:", file.fieldname);
    console.log("File:", file);

    const config = UPLOAD_CONFIG[file.fieldname];

    if (!config) {
      return cb(new Error(`Unauthorized field: ${file.fieldname}`));
    }

    const uploadDir = path.join(process.cwd(), "uploads", config.folder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

    cb(null, uniqueName);
  },
});

/**
 * File Validation
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only jpeg, jpg, png and webp images are allowed"));
  }

  cb(null, true);
};

/**
 * Multer Instance
 */
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * Create Route Upload Middleware
 */
const createUploadMiddleware = (fields) => {
  const multerFields = fields.map((field) => ({
    name: field,
    maxCount: UPLOAD_CONFIG[field]?.maxCount || 1,
  }));

  return upload.fields(multerFields);
};

module.exports = {
  upload,
  UPLOAD_CONFIG,
  createUploadMiddleware,
};

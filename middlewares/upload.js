const multer = require("multer");

function createStorage(fileName) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${fileName}`);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
}

const upload = multer({ storage: createStorage("products") });
const logoUpload = multer({
  storage: createStorage("logos"),
});

module.exports = { upload, logoUpload };

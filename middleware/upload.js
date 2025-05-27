const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

function handleSingleUpload(req, res, fieldName) {
  return new Promise((resolve, reject) => {
    upload.single(fieldName)(req, res, function (err) {
      if (err) return reject(err);
      resolve(req.file);
    });
  });
}

module.exports = { handleSingleUpload };

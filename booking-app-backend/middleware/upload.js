// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Chemin absolu vers le dossier uploads (à la racine du projet)
const uploadFolder = path.join(__dirname, '..', 'uploads');

// Vérifier et créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Veuillez uploader uniquement des images.'), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;

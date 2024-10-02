const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

// Configuración del almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'menus', // Carpeta en Cloudinary donde se guardarán las imágenes
    format: async (req, file) => 'png', // Puedes cambiar el formato si lo deseas
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`, // Nombre del archivo
  },
});

// Filtro de archivos permitido (puedes ajustarlo según los tipos que desees permitir)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

// Crear el middleware de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Tamaño máximo del archivo: 5MB
  },
});

module.exports = upload;

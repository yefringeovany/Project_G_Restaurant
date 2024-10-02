const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Del Dashboard de Cloudinary
  api_key: process.env.CLOUDINARY_API_KEY,       // Del Dashboard de Cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET, // Del Dashboard de Cloudinary
});

module.exports = cloudinary;
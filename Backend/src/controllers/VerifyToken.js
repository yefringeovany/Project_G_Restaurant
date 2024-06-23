const jwt = require('jsonwebtoken');
const config = require('../config/config');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No se proporciona ningún token'
    });
  }

  const decoded = jwt.verify(token, config.secret);
  req.usuarioId = decoded.id;
  next();
}

module.exports = verifyToken;

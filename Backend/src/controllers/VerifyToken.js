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

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        auth: false,
        message: 'Token inválido'
      });
    }
    req.usuarioId = decoded.id;
    next();
  });
}

module.exports = verifyToken;

// Importamos el módulo jsonwebtoken para trabajar con JWT
const jwt = require('jsonwebtoken');
// Importamos la configuración donde se encuentra la clave secreta
const config = require('../config/config');

// Función para verificar el token
function verifyToken(req, res, next) {
    // Obtenemos el token de los headers de la solicitud
  const token = req.headers['x-access-token'];
  console.log(' Token: ', token )
  // Si no hay token, respondemos con un error 401 (No autorizado)
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No se proporciona ningún token'
    });
  }

    // Verificamos el token usando la clave secreta
  jwt.verify(token, config.secret, (err, decoded) => {
        // Si hay un error en la verificación, respondemos con un error 403 (Prohibido)
    if (err) {
      return res.status(403).json({
        auth: false,
        message: 'Token inválido'
      });
    }

        // Si el token es válido, guardamos el id del usuario en la solicitud y continuamos
    req.usuarioId = decoded.id;
    next();
  });
}

// Exportamos la función para que pueda ser utilizada en otros archivos
module.exports = verifyToken;

const jwt = require('jsonwebtoken');
const verifyToken = require('../src/controllers/VerifyToken.js'); // Ruta hacia el archivo de tu middleware

jest.mock('jsonwebtoken'); // Mockear el módulo jsonwebtoken

describe('verifyToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('debe retornar 401 si no se proporciona ningún token', () => {
    req.headers['x-access-token'] = null;

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      auth: false,
      message: 'No se proporciona ningún token'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('debe retornar 403 si el token es inválido', () => {
    req.headers['x-access-token'] = 'token_invalido';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token inválido'), null);
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      auth: false,
      message: 'Token inválido'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('debe llamar a next() si el token es válido', () => {
    req.headers['x-access-token'] = 'token_valido';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: 1 });
    });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.usuarioId).toBe(1);
  });
});

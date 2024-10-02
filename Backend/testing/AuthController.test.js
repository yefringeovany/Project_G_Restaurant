const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthController = require('../src/controllers/AuthController'); // Asegúrate de que esta ruta sea correcta
const Usuario = require('../src/models/Usuario'); // Asegúrate de que esta ruta sea correcta
const { verifyToken } = require('../src/controllers/VerifyToken'); // Asegúrate de que esta ruta sea correcta

// Inicializa la aplicación Express
const app = express();
app.use(express.json());
app.use(AuthController); // Monta el controlador en la aplicación

// Mocks
jest.mock('../src/models/Usuario');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../src/controllers/VerifyToken.js'); // Mocks de la implementación


describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  describe('POST /user/register', () => {
    it('debería registrar un nuevo usuario y devolver un token', async () => {
      const usuarioData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: 'juan.perez@example.com',
        contrasenia: '123456',
        rol: 'cliente',
      };

      // Simula el método save() del modelo Usuario
      Usuario.prototype.save = jest.fn().mockResolvedValue(usuarioData);
      jest.spyOn(jwt, 'sign').mockReturnValue('token'); // Mock del token JWT

      const response = await request(app)
        .post('/user/register')
        .send(usuarioData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        auth: true,
        token: 'token',
      });
      expect(Usuario.prototype.save).toHaveBeenCalled(); // Verifica que se llamó a save
    });

    it('debería devolver un error 500 si ocurre un error al registrar', async () => {
      const usuarioData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: 'juan.perez@example.com',
        contrasenia: '123456',
        rol: 'cliente',
      };

      // Simula un error al guardar
      Usuario.prototype.save = jest.fn().mockRejectedValue(new Error('Error al guardar'));

      const response = await request(app)
        .post('/user/register')
        .send(usuarioData);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error interno del servidor');
    });
  });

  describe('POST /user/login', () => {
    it('debería iniciar sesión y devolver un token', async () => {
      const usuarioData = {
        correo_electronico: 'juan.perez@example.com',
        contrasenia: '123456',
      };

      const usuario = {
        id: 1,
        rol: 'cliente',
        nombre: 'Juan',
        apellido: 'Pérez',
        contrasenia: await bcrypt.hash('123456', 10),
      };

      // Simula la búsqueda del usuario
      Usuario.findOne = jest.fn().mockResolvedValue(usuario);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue('token');

      const response = await request(app)
        .post('/user/login')
        .send(usuarioData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        auth: true,
        token: 'token',
      });
    });

    it('debería devolver un error 404 si el usuario no existe', async () => {
      const usuarioData = {
        correo_electronico: 'juan.perez@example.com',
        contrasenia: '123456',
      };

      Usuario.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/user/login')
        .send(usuarioData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Usuario no encontrado' });
    });

    it('debería devolver un error 401 si la contraseña es incorrecta', async () => {
      const usuarioData = {
        correo_electronico: 'juan.perez@example.com',
        contrasenia: '123456',
      };

      const usuario = {
        id: 1,
        rol: 'cliente',
        nombre: 'Juan',
        apellido: 'Pérez',
        contrasenia: await bcrypt.hash('wrong_password', 10),
      };

      Usuario.findOne = jest.fn().mockResolvedValue(usuario);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const response = await request(app)
        .post('/user/login')
        .send(usuarioData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ auth: false, token: null, error: 'Contraseña incorrecta' });
    });
  });

  describe('GET /user/profile', () => {
    it('debería devolver el perfil del usuario', async () => {
      const usuarioId = 1;
      const usuario = {
        id: usuarioId,
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: 'juan.perez@example.com',
        rol: 'cliente',
        contrasenia: 'hashed_password',
      };

      jest.spyOn(verifyToken, 'verifyToken').mockImplementation((req, res, next) => {
        req.usuarioId = usuarioId; // Simula la id del usuario en el token
        next();
      });

      Usuario.findByPk = jest.fn().mockResolvedValue(usuario);

      const response = await request(app)
        .get('/user/profile')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: usuarioId,
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: 'juan.perez@example.com',
        rol: 'cliente',
      });
    });

    it('debería devolver un error 404 si el usuario no existe', async () => {
      const usuarioId = 1;

      jest.spyOn(verifyToken, 'verifyToken').mockImplementation((req, res, next) => {
        req.usuarioId = usuarioId; // Simula la id del usuario en el token
        next();
      });

      Usuario.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/user/profile')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Usuario no encontrado');
    });
  });

  describe('PUT /user/update/:id', () => {
    it('debería actualizar un usuario existente', async () => {
      const usuarioId = 1;
      const updateData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: 'juan.perez@example.com',
        rol: 'cliente',
      };

      jest.spyOn(verifyToken, 'verifyToken').mockImplementation((req, res, next) => {
        req.usuarioId = usuarioId; // Simula la id del usuario en el token
        next();
      });

      Usuario.findByPk = jest.fn().mockResolvedValue(updateData);
      Usuario.findOne = jest.fn().mockResolvedValue(null); // Simula que no hay conflictos de correo
      Usuario.prototype.save = jest.fn().mockResolvedValue(updateData); // Simula guardado exitoso

      const response = await request(app)
        .put(`/user/update/${usuarioId}`)
        .set('Authorization', 'Bearer token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updateData);
    });

    it('debería devolver un error 404 si el usuario no existe', async () => {
      const usuarioId = 1;
      const updateData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: 'juan.perez@example.com',
        rol: 'cliente',
      };

      jest.spyOn(verifyToken, 'verifyToken').mockImplementation((req, res, next) => {
        req.usuarioId = usuarioId; // Simula la id del usuario en el token
        next();
      });

      Usuario.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put(`/user/update/${usuarioId}`)
        .set('Authorization', 'Bearer token')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.text).toBe('Usuario no encontrado');
    });

    it('debería devolver un error 400 si faltan datos requeridos', async () => {
      const usuarioId = 1;
      const response = await request(app)
        .put(`/user/update/${usuarioId}`)
        .set('Authorization', 'Bearer token')
        .send({}); // Enviamos un objeto vacío

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Faltan datos requeridos' });
    });
  });

  describe('DELETE /user/delete/:id', () => {
    it('debería eliminar un usuario existente', async () => {
      const usuarioId = 1;

      Usuario.destroy = jest.fn().mockResolvedValue(1); // Simula la eliminación exitosa

      const response = await request(app)
        .delete(`/user/delete/${usuarioId}`)
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toBe(1);
    });
  });

  describe('GET /user/list', () => {
    it('debería devolver la lista de usuarios', async () => {
      const usuarios = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          correo_electronico: 'juan.perez@example.com',
          rol: 'cliente',
        },
      ];

      Usuario.findAll = jest.fn().mockResolvedValue(usuarios);

      const response = await request(app)
        .get('/user/list')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuarios);
    });
  });

  describe('GET /user/:id', () => {
    it('debería devolver un usuario por ID', async () => {
      const usuarioId = 1;
      const usuario = {
        id: usuarioId,
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: 'juan.perez@example.com',
        rol: 'cliente',
      };

      Usuario.findByPk = jest.fn().mockResolvedValue(usuario);

      const response = await request(app)
        .get(`/user/${usuarioId}`)
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuario);
    });

    it('debería devolver un error 404 si el usuario no existe', async () => {
      const usuarioId = 1;

      Usuario.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get(`/user/${usuarioId}`)
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Usuario no encontrado');
    });
  });
});

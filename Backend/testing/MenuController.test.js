
const request = require('supertest');
const express = require('express');

const { Router } = require('express');
const MenuController = require('../src/controllers/MenuController');
const Menu = require('../src/models/Menu');

// Mock del modelo Menu
jest.mock('../src/models/Menu', () => ({
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn()
}));

// Crear una instancia de la app Express
const app = express();
app.use(express.json());
app.use('/', MenuController);

// Mock de verifyToken
jest.mock('../src/controllers/VerifyToken.js', () => (req, res, next) => {
  next();
});
// Mock de multer
jest.mock('../src/multer/multerConfig', () => ({
  single: jest.fn(() => (req, res, next) => {
    req.file = { filename: 'test_image.jpg' }; // Simular una carga de imagen
    next();
  })
}));

describe('MenuController', () => {

  describe('POST /menu/register', () => {
    it('Debe registrar un nuevo menú con imagen', async () => {
      const mockMenu = {
        id: 1,
        categoria_id: 1,
        nombre: 'Menu 1',
        descripcion: 'Descripción 1',
        precio: 100,
        estado: 'Disponible',
        imagen: 'test_image.jpg'
      };

      Menu.create.mockResolvedValue(mockMenu);

      const res = await request(app)
        .post('/menu/register')
        .send({
          categoria_id: 1,
          nombre: 'Menu 1',
          descripcion: 'Descripción 1',
          precio: 100,
          estado: 'Disponible'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockMenu);
    });

    it('Debe manejar errores al registrar un menú', async () => {
      Menu.create.mockRejectedValue(new Error('Error interno del servidor'));

      const res = await request(app)
        .post('/menu/register')
        .send({
          categoria_id: 1,
          nombre: 'Menu 1',
          descripcion: 'Descripción 1',
          precio: 100,
          estado: 'Disponible'
        });

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error interno del servidor');
    });
  });

  describe('PUT /menu/update/:id', () => {
    it('Debe actualizar un menú existente', async () => {
      const mockMenu = {
        id: 1,
        categoria_id: 1,
        nombre: 'Menu 1',
        descripcion: 'Descripción 1',
        precio: 100,
        estado: 'Disponible',
        update: jest.fn().mockImplementation(function (updates) {
          Object.assign(this, updates);
          return Promise.resolve(this);
        })
      };

      Menu.findByPk.mockResolvedValue(mockMenu);

      const res = await request(app)
        .put('/menu/update/1')
        .send({
          categoria_id: 1,
          nombre: 'Menu 1 Updated',
          descripcion: 'Descripción 1 Updated',
          precio: 120,
          estado: 'Disponible'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('nombre', 'Menu 1 Updated');
    });

    it('Debe devolver 404 si el menú no existe', async () => {
      Menu.findByPk.mockResolvedValue(null);

      const res = await request(app).put('/menu/update/999').send({});

      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Menú no encontrado');
    });

    it('Debe manejar errores al actualizar un menú', async () => {
      const mockMenu = {
        id: 1,
        categoria_id: 1,
        nombre: 'Menu 1',
        descripcion: 'Descripción 1',
        precio: 100,
        estado: 'Disponible',
        update: jest.fn().mockRejectedValue(new Error('Error de actualización'))
      };

      Menu.findByPk.mockResolvedValue(mockMenu);

      const res = await request(app)
        .put('/menu/update/1')
        .send({});

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error interno del servidor');
    });
  });

  describe('PUT /menu/update/:id/imagen', () => {
    it('Debe devolver 404 si el menú no existe al actualizar imagen', async () => {
      Menu.findByPk.mockResolvedValue(null);

      const res = await request(app).put('/menu/update/999/imagen');

      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Menú no encontrado');
    });

    it('Debe manejar errores al actualizar la imagen de un menú', async () => {
      const mockMenu = {
        id: 1,
        categoria_id: 1,
        nombre: 'Menu 1',
        descripcion: 'Descripción 1',
        precio: 100,
        estado: 'Disponible',
        save: jest.fn().mockRejectedValue(new Error('Error de actualización'))
      };

      Menu.findByPk.mockResolvedValue(mockMenu);

      const res = await request(app).put('/menu/update/1/imagen');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error interno del servidor');
    });
  });

  describe('DELETE /menu/delete/:id', () => {
    it('Debe eliminar un menú', async () => {
      Menu.destroy.mockResolvedValue(1); // Simular que se eliminó un registro

      const res = await request(app).delete('/menu/delete/1');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(1);
    });

    it('Debe manejar errores al eliminar un menú', async () => {
      Menu.destroy.mockRejectedValue(new Error('Error interno del servidor'));

      const res = await request(app).delete('/menu/delete/1');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error interno del servidor');
    });
  });

  describe('GET /menu/list', () => {
    it('Debe obtener la lista de menús', async () => {
      const mockMenus = [
        { id: 1, categoria_id: 1, nombre: 'Menu 1', descripcion: 'Descripción 1', precio: 100, estado: 'Disponible', imagen: 'test_image.jpg' },
        { id: 2, categoria_id: 2, nombre: 'Menu 2', descripcion: 'Descripción 2', precio: 150, estado: 'Disponible', imagen: 'test_image2.jpg' }
      ];

      Menu.findAll.mockResolvedValue(mockMenus);

      const res = await request(app).get('/menu/list');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('nombre', 'Menu 1');
      expect(res.body[1]).toHaveProperty('nombre', 'Menu 2');
    });

    it('Debe manejar errores al obtener la lista de menús', async () => {
      Menu.findAll.mockRejectedValue(new Error('Error interno del servidor'));

      const res = await request(app).get('/menu/list');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error interno del servidor');
    });
  });

  describe('GET /menu/:id', () => {
    it('Debe obtener un menú por ID', async () => {
      const mockMenu = {
        id: 1,
        categoria_id: 1,
        nombre: 'Menu 1',
        descripcion: 'Descripción 1',
        precio: 100,
        estado: 'Disponible',
        imagen: 'test_image.jpg'
      };

      Menu.findByPk.mockResolvedValue(mockMenu);

      const res = await request(app).get('/menu/1');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('nombre', 'Menu 1');
    });

    it('Debe devolver 404 si el menú no existe', async () => {
      Menu.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/menu/999');

      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Menú no encontrado');
    });

    it('Debe manejar errores al obtener un menú por ID', async () => {
      Menu.findByPk.mockRejectedValue(new Error('Error interno del servidor'));

      const res = await request(app).get('/menu/1');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error interno del servidor');
    });
  });
});
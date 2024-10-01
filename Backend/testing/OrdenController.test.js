const request = require('supertest');
const app = require('../src/app/app'); // Ruta a tu archivo app.js
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken'); // Mockear jsonwebtoken para evitar dependencia real de tokens

// Mockear los modelos de la base de datos
jest.mock('../src/models/Orden.js', () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
}));

jest.mock('../src/models/OrdenMenu.js', () => ({
  create: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../src/models/Usuario.js', () => ({
  findByPk: jest.fn(),
}));

const Orden = require('../src/models/Orden');
const OrdenMenu = require('../src/models/OrdenMenu');

describe('OrdenController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  describe('POST /orden/register', () => {
    it('debería registrar una nueva orden', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 }); // Simular token decodificado con ID de usuario 1
      });

      const nuevaOrden = {
        id: 1,
        monto_total: 100,
        pagado: true,
        cambio: 0,
        estado: 'CREADO',
        usuario_id: 1,
      };

      Orden.create.mockResolvedValue(nuevaOrden);

      const res = await request(app)
        .post('/orden/register')
        .set('x-access-token', 'token_valido')
        .send({
          monto_total: 100,
          pagado: true,
          cambio: 0,
          estado: 'CREADO',
          menu_items: [{ menu_id: 1, cantidad: 2 }],
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(nuevaOrden);
      expect(Orden.create).toHaveBeenCalledWith({
        monto_total: 100,
        pagado: true,
        cambio: 0,
        estado: 'CREADO',
        usuario_id: 1,
      });
      expect(OrdenMenu.create).toHaveBeenCalledWith({
        orden_id: nuevaOrden.id,
        menu_id: 1,
        cantidad: 2,
      });
    });

    it('debería devolver error 500 si ocurre un error al registrar la orden', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      Orden.create.mockRejectedValue(new Error('Error al registrar la orden'));

      const res = await request(app)
        .post('/orden/register')
        .set('x-access-token', 'token_valido')
        .send({
          monto_total: 100,
          pagado: true,
          cambio: 0,
          estado: 'CREADO',
          menu_items: [{ menu_id: 1, cantidad: 2 }],
        });

      expect(res.statusCode).toEqual(500);
      expect(res.text).toBe('Error interno del servidor');
    });
  });

  describe('PUT /orden/update/:id', () => {
    it('debería actualizar el estado de una orden', async () => {
      const ordenMock = { 
        id: 1, 
        estado: 'CREADO', 
        update: jest.fn().mockImplementation(function(updateFields) {
          Object.assign(this, updateFields);
          return Promise.resolve(this);
        }) 
      };
  
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });
  
      Orden.findByPk.mockResolvedValue(ordenMock);
  
      const res = await request(app)
        .put('/orden/update/1')
        .set('x-access-token', 'token_valido')
        .send({ estado: 'TERMINADO' });
  
      expect(res.statusCode).toEqual(200);
      expect(ordenMock.update).toHaveBeenCalledWith({ estado: 'TERMINADO' });
      expect(res.body).toEqual({ id: 1, estado: 'TERMINADO' });
    });
  
    it('debería devolver 404 si la orden no existe', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });
  
      Orden.findByPk.mockResolvedValue(null);
  
      const res = await request(app)
        .put('/orden/update/1')
        .set('x-access-token', 'token_valido')
        .send({ estado: 'TERMINADO' });
  
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Orden no encontrada' });
    });
  
    it('debería devolver 500 en caso de error interno', async () => {
      const ordenMock = { id: 1, estado: 'CREADO', update: jest.fn().mockRejectedValue(new Error('Error de base de datos')) };
  
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });
  
      Orden.findByPk.mockResolvedValue(ordenMock);
  
      const res = await request(app)
        .put('/orden/update/1')
        .set('x-access-token', 'token_valido')
        .send({ estado: 'TERMINADO' });
  
      expect(res.statusCode).toEqual(500);
      expect(res.text).toBe('Error interno del servidor');
    });
  });

  describe('DELETE /orden/delete/:id', () => {

    it('debería eliminar una orden y su relación en OrdenMenu', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      Orden.destroy.mockResolvedValue(1); // Simula que una orden fue eliminada

      const res = await request(app)
        .delete('/orden/delete/1')
        .set('x-access-token', 'token_valido');

      expect(res.statusCode).toEqual(200);
      expect(Orden.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(OrdenMenu.destroy).toHaveBeenCalledWith({ where: { orden_id: '1' } });
    });

    it('debería devolver error 500 si ocurre un error al eliminar la orden', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      Orden.destroy.mockRejectedValue(new Error('Error al eliminar la orden'));

      const res = await request(app)
        .delete('/orden/delete/1')
        .set('x-access-token', 'token_valido');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toBe('Error interno del servidor');
    });
  });

  describe('GET /orden/list', () => {
    it('debería devolver una lista de órdenes', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      const ordenesMock = [{ id: 1, estado: 'CREADO' }, { id: 2, estado: 'ENTREGADO' }];

      Orden.findAll.mockResolvedValue(ordenesMock);

      const res = await request(app)
        .get('/orden/list')
        .set('x-access-token', 'token_valido');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(ordenesMock);
    });

    it('debería devolver error 500 si ocurre un error al obtener las órdenes', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      Orden.findAll.mockRejectedValue(new Error('Error al obtener las órdenes'));

      const res = await request(app)
        .get('/orden/list')
        .set('x-access-token', 'token_valido');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toBe('Error interno del servidor');
    });
  });
});

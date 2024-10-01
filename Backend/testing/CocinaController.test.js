// Importamos las dependencias necesarias
const request = require('supertest'); // Para realizar peticiones HTTP en las pruebas
const express = require('express'); // Para crear una aplicación Express simulada
const createRouter = require('../src/controllers/CocinaController'); // Importamos la función para crear el controlador
const { Sequelize } = require('sequelize'); // Importamos Sequelize
require('dotenv').config(); // Cargar variables de entorno

// Mock de Sequelize para simular las consultas
jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');

  // Crea el mock del constructor de Sequelize
  return {
    Sequelize: jest.fn(() => ({
      query: jest.fn(),
    })),
    QueryTypes: actualSequelize.QueryTypes,
  };
});

// Creamos una aplicación express para simular las rutas
const app = express();
app.use(express.json());
const sequelize = new Sequelize(); // Instancia del mock de Sequelize
app.use('/', createRouter(sequelize)); // Asociamos las rutas del controlador con la instancia mock de Sequelize

// Mock del middleware verifyToken
jest.mock('../src/controllers/VerifyToken.js', () => (req, res, next) => {
  // Simulamos que siempre pasa la verificación del token
  next();
});

describe('CocinaController', () => {
  // Prueba para verificar que las órdenes pendientes se devuelven correctamente
  it('debería devolver la lista de órdenes pendientes agrupadas por orden', async () => {
    // Simulamos la consulta SQL exitosa
    sequelize.query.mockResolvedValue([
      {
        orden_id: 1,
        estado: 'PENDIENTE',
        menu_id: 1,
        menu_nombre: 'Pizza',
        cantidad: 2,
        descripcion: 'Pizza con queso',
        imagen: 'imagen_pizza.jpg',
      },
      {
        orden_id: 1,
        estado: 'PENDIENTE',
        menu_id: 2,
        menu_nombre: 'Pasta',
        cantidad: 1,
        descripcion: 'Pasta con salsa',
        imagen: 'imagen_pasta.jpg',
      },
    ]);

    const res = await request(app).get('/kitchen/list'); // Simulamos una solicitud GET
    
    console.log(res.body); // Log the response body for debugging
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        estado: 'PENDIENTE',
        menus: [
          {
            id: 1,
            nombre: 'Pizza',
            cantidad: 2,
            descripcion: 'Pizza con queso',
            imagen: 'imagen_pizza.jpg',
          },
          {
            id: 2,
            nombre: 'Pasta',
            cantidad: 1,
            descripcion: 'Pasta con salsa',
            imagen: 'imagen_pasta.jpg',
          },
        ],
      },
    ]);
  });

  // Prueba para verificar el comportamiento en caso de fallo en la consulta
  it('debería devolver un error 500 si la consulta falla', async () => {
    // Simulamos un fallo en la consulta
    sequelize.query.mockRejectedValue(new Error('Error al ejecutar la consulta'));

    const res = await request(app).get('/kitchen/list'); // Simulamos la solicitud GET

    // Verificamos que el código de estado sea 500 y el mensaje de error sea el esperado
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error interno del servidor');
  });
});

const request = require('supertest');
const express = require('express');

const { Router } = require('express');
const CategoriaController = require('../src/controllers/CategoriaController'); // Asegúrate de que la ruta sea correcta
const Categoria = require('../src/models/Categoria');

// Mock del modelo Categoria
jest.mock('../src/models/Categoria', () => ({
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
}));

// Crear una instancia de la app Express
const app = express();
app.use(express.json());
app.use('/', CategoriaController);

// Mock de verifyToken
jest.mock('../src/controllers/VerifyToken.js', () => (req, res, next) => {
    next();
});

describe('CategoriaController', () => {
    describe('POST /categoria/register', () => {
        it('Debe registrar una nueva categoría', async () => {
            const mockCategoria = {
                id: 2,
                nombre: 'Categoría 1',
                descripcion: 'Descripción 1',
                estado: 'Disponible',
            };

            Categoria.create.mockResolvedValue(mockCategoria);

            const res = await request(app)
                .post('/categoria/register')
                .send({
                    nombre: 'Categoría 1',
                    descripcion: 'Descripción 1',
                    estado: 'Disponible',
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(mockCategoria);
        });

        it('Debe manejar errores al registrar una categoría', async () => {
            Categoria.create.mockRejectedValue(new Error('Error interno del servidor'));

            const res = await request(app)
                .post('/categoria/register')
                .send({
                    nombre: 'Categoría 1',
                    descripcion: 'Descripción 1',
                    estado: 'TERMINADO',
                });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual('Error interno del servidor');
        });
    });

    describe('PUT /categoria/update/:id', () => {
        it('Debe actualizar una categoría existente', async () => {
            const mockCategoria = {
                id: 1,
                nombre: 'Categoría 1',
                descripcion: 'Descripción 1',
                estado: 'Disponible',
                update: jest.fn().mockImplementation(function (updates) {
                    Object.assign(this, updates);
                    return Promise.resolve(this);
                }),
            };

            Categoria.findByPk.mockResolvedValue(mockCategoria);

            const res = await request(app)
                .put('/categoria/update/1')
                .send({
                    nombre: 'Categoría 1 Actualizada',
                    descripcion: 'Descripción 1 Actualizada',
                    estado: 'Disponible',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('nombre', 'Categoría 1 Actualizada');
        });

        it('Debe devolver 404 si la categoría no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            const res = await request(app).put('/categoria/update/999').send({});

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual('Categoría no encontrada');
        });

        it('Debe manejar errores al actualizar una categoría', async () => {
            const mockCategoria = {
                id: 1,
                nombre: 'Categoría 1',
                descripcion: 'Descripción 1',
                estado: 'Disponible',
                update: jest.fn().mockRejectedValue(new Error('Error de actualización')),
            };

            Categoria.findByPk.mockResolvedValue(mockCategoria);

            const res = await request(app).put('/categoria/update/1').send({});

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual('Error interno del servidor');
        });
    });

    describe('DELETE /categoria/delete/:id', () => {
        it('Debe eliminar una categoría', async () => {
            Categoria.destroy.mockResolvedValue(1); // Simular que se eliminó un registro

            const res = await request(app).delete('/categoria/delete/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(1);
        });

        it('Debe manejar errores al eliminar una categoría', async () => {
            Categoria.destroy.mockRejectedValue(new Error('Error interno del servidor'));

            const res = await request(app).delete('/categoria/delete/1');

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual('Error interno del servidor');
        });
    });

    describe('GET /categoria/list', () => {
        it('Debe obtener la lista de categorías', async () => {
            const mockCategorias = [
                { id: 1, nombre: 'Categoría 1', descripcion: 'Descripción 1', estado: 'Disponible' },
                { id: 2, nombre: 'Categoría 2', descripcion: 'Descripción 2', estado: 'Disponible' },
            ];

            Categoria.findAll.mockResolvedValue(mockCategorias);

            const res = await request(app).get('/categoria/list');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty('nombre', 'Categoría 1');
            expect(res.body[1]).toHaveProperty('nombre', 'Categoría 2');
        });

        it('Debe manejar errores al obtener la lista de categorías', async () => {
            Categoria.findAll.mockRejectedValue(new Error('Error interno del servidor'));

            const res = await request(app).get('/categoria/list');

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual('Error interno del servidor');
        });
    });

    describe('GET /categoria/:id', () => {
        it('Debe obtener una categoría por ID', async () => {
            const mockCategoria = {
                id: 1,
                nombre: 'Categoría 1',
                descripcion: 'Descripción 1',
                estado: 'Disponible',
            };

            Categoria.findByPk.mockResolvedValue(mockCategoria);

            const res = await request(app).get('/categoria/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('nombre', 'Categoría 1');
        });

        it('Debe devolver 404 si la categoría no existe', async () => {
            Categoria.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/categoria/999');

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual('Categoría no encontrada');
        });

        it('Debe manejar errores al obtener una categoría por ID', async () => {
            Categoria.findByPk.mockRejectedValue(new Error('Error interno del servidor'));

            const res = await request(app).get('/categoria/1');

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual('Error interno del servidor');
        });
    });
});

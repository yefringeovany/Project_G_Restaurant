const { Router } = require('express');
const router = Router();

const Categoria = require('../models/categoria');
const verifyToken = require('./VerifyToken');

// Ruta POST para registrar una nueva categoría
router.post('/categoria/register', verifyToken, async (req, res, next) => {
  try {
    // Extraer nombre, descripción y estado del cuerpo de la solicitud
    const { nombre, descripcion, estado } = req.body;
    // Crear una nueva categoría en la base de datos utilizando el modelo 'Categoria'
    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
      estado
    });
    // Responder con un código 201 (creado) y la nueva categoría creada
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al registrar nueva categoría:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta PUT para actualizar una categoría existente
router.put('/categoria/update/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;
    // Buscar la categoría en la base de datos utilizando el ID proporcionado
    const categoria = await Categoria.findByPk(id);
    // Si la categoría no se encuentra, enviar una respuesta 404 (No encontrado)
    if (!categoria) {
      return res.status(404).send('Categoría no encontrada');
    }
    // Actualizar la categoría con los nuevos datos proporcionados
    const categoriaActualizada = await categoria.update({
      nombre,
      descripcion,
      estado
    });
    res.status(200).json(categoriaActualizada);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//Ruta para eliminar una categoria
router.delete('/categoria/delete/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoritaEliminada = await Categoria.destroy({ where: { id } });
    res.status(200).json(categoritaEliminada);
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//Ruta para mostrar la lista de categorias
router.get('/categoria/list', verifyToken, async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener la lista de categorías:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//Ruta para mostrar la categoria por id
router.get('/categoria/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).send('Categoría no encontrada');
    }
    res.json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
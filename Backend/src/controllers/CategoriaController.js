const { Router } = require('express');
const router = Router();

const Categoria = require('../models/Categoria');
const verifyToken = require('./VerifyToken');

router.post('/categoria/register', verifyToken, async (req, res, next) => {
  try {
    const { nombre, descripcion, estado } = req.body;
    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
      estado
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al registrar nueva categoría:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.put('/categoria/update/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).send('Categoría no encontrada');
    }
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

router.get('/categoria/list', verifyToken, async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener la lista de categorías:', error);
    res.status(500).send('Error interno del servidor');
  }
});

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
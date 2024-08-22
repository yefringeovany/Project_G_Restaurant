const { Router } = require('express');
const router = Router();

const Producto = require('../models/Producto');
const verifyToken = require('./VerifyToken');

// Registrar un nuevo producto
router.post('/producto/register', verifyToken, async (req, res) => {
  try {
    const { ProductoDescripcion } = req.body;
    const nuevoProducto = await Producto.create({ ProductoDescripcion });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al registrar nuevo producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar un producto por ProductoNumero
router.put('/producto/update/:ProductoNumero', verifyToken, async (req, res) => {
  try {
    const { ProductoNumero } = req.params;
    const { ProductoDescripcion } = req.body;
    const producto = await Producto.findByPk(ProductoNumero);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }
    const productoActualizado = await producto.update({ ProductoDescripcion });
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar un producto por ProductoNumero
router.delete('/producto/delete/:ProductoNumero', verifyToken, async (req, res) => {
  try {
    const { ProductoNumero } = req.params;
    const productoEliminado = await Producto.destroy({ where: { ProductoNumero } });
    res.status(200).json(productoEliminado);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener todos los productos
router.get('/producto/list', verifyToken, async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener un producto por ProductoNumero
router.get('/producto/:ProductoNumero', verifyToken, async (req, res) => {
  try {
    const { ProductoNumero } = req.params;
    const producto = await Producto.findByPk(ProductoNumero);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto por ProductoNumero:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
const { Router } = require('express');
const router = Router();

const DetalleSeccionMenu = require('../models/DetalleSeccionMenu');
const verifyToken = require('./VerifyToken');

// Registrar un nuevo detalle de sección de menú
router.post('/detalleseccionmenu/register', verifyToken, async (req, res) => {
  try {
    const { MenuNumero, SeccionMenuNumero, ProductoNumero, Precio } = req.body;
    const nuevoDetalleSeccionMenu = await DetalleSeccionMenu.create({
      MenuNumero,
      SeccionMenuNumero,
      ProductoNumero,
      Precio
    });
    res.status(201).json(nuevoDetalleSeccionMenu);
  } catch (error) {
    console.error('Error al registrar nuevo detalle de sección de menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar un detalle de sección de menú por DetalleSeccionNumero
router.put('/detalleseccionmenu/update/:DetalleSeccionNumero', verifyToken, async (req, res) => {
  try {
    const { DetalleSeccionNumero } = req.params;
    const { MenuNumero, SeccionMenuNumero, ProductoNumero, Precio } = req.body;
    const detalleSeccionMenu = await DetalleSeccionMenu.findByPk(DetalleSeccionNumero);
    if (!detalleSeccionMenu) {
      return res.status(404).send('Detalle de sección de menú no encontrado');
    }
    const detalleSeccionMenuActualizado = await detalleSeccionMenu.update({
      MenuNumero,
      SeccionMenuNumero,
      ProductoNumero,
      Precio
    });
    res.status(200).json(detalleSeccionMenuActualizado);
  } catch (error) {
    console.error('Error al actualizar el detalle de sección de menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar un detalle de sección de menú por DetalleSeccionNumero
router.delete('/detalleseccionmenu/delete/:DetalleSeccionNumero', verifyToken, async (req, res) => {
  try {
    const { DetalleSeccionNumero } = req.params;
    const detalleSeccionMenuEliminado = await DetalleSeccionMenu.destroy({ where: { DetalleSeccionNumero } });
    res.status(200).json(detalleSeccionMenuEliminado);
  } catch (error) {
    console.error('Error al eliminar el detalle de sección de menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener todos los detalles de secciones de menú
router.get('/detalleseccionmenu/list', verifyToken, async (req, res) => {
  try {
    const detallesSeccionMenu = await DetalleSeccionMenu.findAll();
    res.json(detallesSeccionMenu);
  } catch (error) {
    console.error('Error al obtener la lista de detalles de secciones de menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener un detalle de sección de menú por DetalleSeccionNumero
router.get('/detalleseccionmenu/:DetalleSeccionNumero', verifyToken, async (req, res) => {
  try {
    const { DetalleSeccionNumero } = req.params;
    const detalleSeccionMenu = await DetalleSeccionMenu.findByPk(DetalleSeccionNumero);
    if (!detalleSeccionMenu) {
      return res.status(404).send('Detalle de sección de menú no encontrado');
    }
    res.json(detalleSeccionMenu);
  } catch (error) {
    console.error('Error al obtener el detalle de sección de menú por DetalleSeccionNumero:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;

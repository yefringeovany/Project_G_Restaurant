const { Router } = require('express');
const router = Router();

const SeccionMenu = require('../models/SeccionMenu');
const verifyToken = require('./VerifyToken');

// Registrar una nueva sección de menú
router.post('/seccionmenu/register', verifyToken, async (req, res) => {
  try {
    const { MenuNumero, SeccionMenuDescripcion } = req.body;
    const nuevaSeccionMenu = await SeccionMenu.create({
      MenuNumero,
      SeccionMenuDescripcion
    });
    res.status(201).json(nuevaSeccionMenu);
  } catch (error) {
    console.error('Error al registrar nueva sección de menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar una sección de menú por SeccionMenuNumero
router.put('/seccionmenu/update/:SeccionMenuNumero', verifyToken, async (req, res) => {
  try {
    const { SeccionMenuNumero } = req.params;
    const { MenuNumero, SeccionMenuDescripcion } = req.body;
    const seccionMenu = await SeccionMenu.findByPk(SeccionMenuNumero);
    if (!seccionMenu) {
      return res.status(404).send('Sección de menú no encontrada');
    }
    const seccionMenuActualizada = await seccionMenu.update({
      MenuNumero,
      SeccionMenuDescripcion
    });
    res.status(200).json(seccionMenuActualizada);
  } catch (error) {
    console.error('Error al actualizar la sección de menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar una sección de menú por SeccionMenuNumero
router.delete('/seccionmenu/delete/:SeccionMenuNumero', verifyToken, async (req, res) => {
  try {
    const { SeccionMenuNumero } = req.params;
    const seccionMenuEliminada = await SeccionMenu.destroy({ where: { SeccionMenuNumero } });
    res.status(200).json(seccionMenuEliminada);
  } catch (error) {
    console.error('Error al eliminar la sección de menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener todas las secciones de menú
router.get('/seccionmenu/list', verifyToken, async (req, res) => {
  try {
    const seccionesMenu = await SeccionMenu.findAll();
    res.json(seccionesMenu);
  } catch (error) {
    console.error('Error al obtener la lista de secciones de menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener una sección de menú por SeccionMenuNumero
router.get('/seccionmenu/:SeccionMenuNumero', verifyToken, async (req, res) => {
  try {
    const { SeccionMenuNumero } = req.params;
    const seccionMenu = await SeccionMenu.findByPk(SeccionMenuNumero);
    if (!seccionMenu) {
      return res.status(404).send('Sección de menú no encontrada');
    }
    res.json(seccionMenu);
  } catch (error) {
    console.error('Error al obtener la sección de menú por SeccionMenuNumero:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;

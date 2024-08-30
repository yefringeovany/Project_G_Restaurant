const { Router } = require('express');
const router = Router();
const Sequelize = require('sequelize');
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = require('../database/database');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql'
});

const Orden = require('../models/Orden');
const OrdenMenu = require('../models/OrdenMenu');
const verifyToken = require('./VerifyToken');

// Ruta para registrar una nueva orden
router.post('/orden/register', verifyToken, async (req, res, next) => {
  try {
    const { monto_total, pagado, cambio, estado, menu_items } = req.body;
    const usuario_id = req.usuarioId; // Obtén el ID del usuario desde el token
    console.log(usuario_id)

    const nuevaOrden = await Orden.create({
      monto_total,
      pagado,
      cambio,
      estado,
      usuario_id  // Asocia la orden con el usuario
    });

    if (menu_items && menu_items.length > 0) {
      await Promise.all(menu_items.map(async (item) => {
        await OrdenMenu.create({
          orden_id: nuevaOrden.id,
          menu_id: item.menu_id,
          cantidad: item.cantidad
        });
      }));
    }

    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error('Error al registrar nueva orden:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.put('/orden/update/:id', verifyToken, async (req, res, next) => {
  try {
    const { estado } = req.body;
    const ordenId = req.params.id;
    const ordenActualizada = await Orden.findByPk(ordenId);
    if (!ordenActualizada) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    await ordenActualizada.update({ estado });
    res.json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.delete('/orden/delete/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const ordenEliminada = await Orden.destroy({ where: { id } });
    await OrdenMenu.destroy({ where: { orden_id: id } });
    res.status(200).json(ordenEliminada);
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/orden/list', verifyToken, async (req, res, next) => {
  try {
    const ordenes = await Orden.findAll();
    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener la lista de ordenes:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/orden/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findByPk(id);
    if (!orden) {
      return res.status(404).send('Orden no encontrada');
    }
    res.json(orden);
  } catch (error) {
    console.error('Error al obtener orden por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
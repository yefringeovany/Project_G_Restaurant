const { Router } = require('express');
const router = Router();
const Sequelize = require('sequelize');
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = require('../database/database');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql'
});

const verifyToken = require('./VerifyToken');

router.get('/kitchen/list', verifyToken, async (req, res, next) => {
  try {
    const ordenes = await sequelize.query(`
      SELECT 
        o.id AS orden_id,
        o.estado,
        o_m.menu_id,
        m.nombre AS menu_nombre,
        o_m.cantidad
      FROM orden AS o 
      INNER JOIN orden_menu AS o_m ON o_m.orden_id = o.id
      INNER JOIN menu AS m ON m.id = o_m.menu_id
      WHERE o.estado = 'PENDIENTE'
      ORDER BY o.id;
    `, { type: Sequelize.QueryTypes.SELECT });
    const ordenesConMenus = {};
    ordenes.forEach((item) => {
      const {
        orden_id,
        estado,
        menu_id,
        menu_nombre,
        cantidad
      } = item;
      if (!ordenesConMenus[orden_id]) {
        ordenesConMenus[orden_id] = {
          id: orden_id,
          estado: estado,
          menus: []
        };
      }
      ordenesConMenus[orden_id].menus.push({
        id: menu_id,
        nombre: menu_nombre,
        cantidad: cantidad
      });
    });
    const ordenesArray = Object.values(ordenesConMenus);
    res.json(ordenesArray);
  } catch (error) {
    console.error('Error al obtener la lista de ordenes:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;

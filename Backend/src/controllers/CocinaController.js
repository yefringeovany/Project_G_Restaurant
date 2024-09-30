require('dotenv').config(); // Cargar variables de entorno
const { Router } = require('express');
const router = Router();
const Sequelize = require('sequelize');
// const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = require('../database/database');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
);

const verifyToken = require('./VerifyToken');

// Ruta GET para obtener la lista de órdenes pendientes en la cocina
router.get('/kitchen/list', verifyToken, async (req, res, next) => {
  try {
    // Ejecutar una consulta SQL para obtener las órdenes pendientes junto con los detalles de los menús asociados
    const ordenes = await sequelize.query(`
      SELECT 
        o.id AS orden_id,
        o.estado,
        o_m.menu_id,
        m.nombre AS menu_nombre,
        o_m.cantidad, 
        m.descripcion,
        m.imagen
      FROM orden AS o 
      INNER JOIN orden_menu AS o_m ON o_m.orden_id = o.id
      INNER JOIN menu AS m ON m.id = o_m.menu_id
      WHERE o.estado = 'PENDIENTE'
      ORDER BY o.id;
    `, { type: Sequelize.QueryTypes.SELECT });// Especificar el tipo de consulta como SELECT

    // Crear un objeto para agrupar las órdenes por su ID
    const ordenesConMenus = {};
    ordenes.forEach((item) => {
      const {
        orden_id,
        estado,
        menu_id,
        menu_nombre,
        cantidad,
        descripcion,
        imagen
      } = item;
      // Si la orden aún no está en el objeto, inicializarla
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
        cantidad: cantidad,
        descripcion: descripcion,
        imagen: imagen
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

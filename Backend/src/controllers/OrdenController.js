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
const Usuario = require('../models/Usuario'); // Importa el modelo Usuario
const verifyToken = require('./VerifyToken');
const { Op } = require('sequelize');


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

// Ruta para actualizar una orden
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

// Ruta para eliminar una orden
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

// Ruta para obtener la lista de órdenes
router.get('/orden/list', verifyToken, async (req, res, next) => {
  try {
    const ordenes = await Orden.findAll({
      include: {
        model: Usuario,
        as: 'usuario',
        attributes: ['rol']
      }
    });

    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener la lista de ordenes:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/orden/entregadas-hoy', verifyToken, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Cuenta el número de órdenes entregadas hoy
    const count = await Orden.count({
      where: {
        fecha_creacion: {
          [Op.between]: [startOfDay, endOfDay]
        },
        estado: 'ENTREGADO'
      }
    });

    res.status(200).json({ totalordeneshoy: count });
  } catch (error) {
    console.error('Error al obtener el conteo de órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para obtener una orden por ID, incluyendo el usuario y su rol
router.get('/orden/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar la orden e incluir los datos del usuario relacionado
    const orden = await Orden.findByPk(id, {
      include: {
        model: Usuario,
        attributes: ['rol'] // Incluye los atributos del usuario que deseas mostrar
      }
    });

    if (!orden) {
      return res.status(404).send('Orden no encontrada');
    }
    // const orden = await Orden.findByPk(id, {});
    // if (!orden) {
    //   return res.status(404).send('Orden no encontrada');
    // }
    res.json(orden);
  } catch (error) {
    console.error('Error al obtener orden por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener la lista de órdenes terminadas
router.get('/orden/list/finish', verifyToken, async (req, res, next) => {
  try {
    const ordenesTerminadas = await Orden.findAll({
      where: {
        estado: 'TERMINADO'
      },
      include: {
        model: Usuario,
        as: 'usuario',
        attributes: ['rol']
      }
    });

    res.status(200).json(ordenesTerminadas);
  } catch (error) {
    console.error('Error al obtener la lista de órdenes terminadas:', error);
    res.status(500).send('Error al obtener las ordenes terminadas');
  }

  // Ruta para entregar una orden
  router.post('/orden/entregar/:id', verifyToken, async (req, res) => {
    try {
      const ordenId = req.params.id;
      const orden = await Orden.findByPk(ordenId);

      if (!orden) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }

      // Marcar la orden como entregada
      orden.estado = 'ENTREGADO';
      await orden.save();

      res.status(200).json({ message: 'Orden entregada con éxito' });
    } catch (error) {
      console.error('Error al entregar la orden:', error);
      res.status(500).json({ message: 'Error al entregar la orden' });
    }
  });




});

module.exports = router;
const { Router } = require('express');
const router = Router();

const Pedido = require('../models/Pedido');
const verifyToken = require('./VerifyToken');

// Registrar un nuevo pedido
router.post('/pedido/register', verifyToken, async (req, res) => {
  try {
    const { TipoPedido, PedidoNumero, FechaSolicitud, Estado } = req.body;
    const nuevoPedido = await Pedido.create({
      TipoPedido,
      PedidoNumero,
      FechaSolicitud,
      Estado
    });
    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error('Error al registrar nuevo pedido:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar un pedido por TipoPedido y PedidoNumero
router.put('/pedido/update/:TipoPedido/:PedidoNumero', verifyToken, async (req, res) => {
  try {
    const { TipoPedido, PedidoNumero } = req.params;
    const { FechaSolicitud, Estado } = req.body;
    const pedido = await Pedido.findOne({ where: { TipoPedido, PedidoNumero } });
    if (!pedido) {
      return res.status(404).send('Pedido no encontrado');
    }
    const pedidoActualizado = await pedido.update({ FechaSolicitud, Estado });
    res.status(200).json(pedidoActualizado);
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar un pedido por TipoPedido y PedidoNumero
router.delete('/pedido/delete/:TipoPedido/:PedidoNumero', verifyToken, async (req, res) => {
  try {
    const { TipoPedido, PedidoNumero } = req.params;
    const pedidoEliminado = await Pedido.destroy({ where: { TipoPedido, PedidoNumero } });
    res.status(200).json(pedidoEliminado);
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener todos los pedidos
router.get('/pedido/list', verifyToken, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener la lista de pedidos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener un pedido por TipoPedido y PedidoNumero
router.get('/pedido/:TipoPedido/:PedidoNumero', verifyToken, async (req, res) => {
  try {
    const { TipoPedido, PedidoNumero } = req.params;
    const pedido = await Pedido.findOne({ where: { TipoPedido, PedidoNumero } });
    if (!pedido) {
      return res.status(404).send('Pedido no encontrado');
    }
    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido por TipoPedido y PedidoNumero:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;

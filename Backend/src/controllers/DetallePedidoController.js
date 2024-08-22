const { Router } = require('express');
const router = Router();

const DetallePedido = require('../models/DetallePedido');
const verifyToken = require('./VerifyToken');

// Registrar un nuevo detalle de pedido
router.post('/detallepedido/register', verifyToken, async (req, res) => {
  try {
    const { TipoPedido, PedidoNumero, ProductoNumero } = req.body;
    const nuevoDetallePedido = await DetallePedido.create({
      TipoPedido,
      PedidoNumero,
      ProductoNumero
    });
    res.status(201).json(nuevoDetallePedido);
  } catch (error) {
    console.error('Error al registrar nuevo detalle de pedido:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar un detalle de pedido por TipoPedido, PedidoNumero y ProductoNumero
router.put('/detallepedido/update/:TipoPedido/:PedidoNumero/:ProductoNumero', verifyToken, async (req, res) => {
  try {
    const { TipoPedido, PedidoNumero, ProductoNumero } = req.params;
    const { newProductoNumero } = req.body;
    const detallePedido = await DetallePedido.findOne({ where: { TipoPedido, PedidoNumero, ProductoNumero } });
    if (!detallePedido) {
      return res.status(404).send('Detalle de pedido no encontrado');
    }
    const detallePedidoActualizado = await detallePedido.update({ ProductoNumero: newProductoNumero });
    res.status(200).json(detallePedidoActualizado);
  } catch (error) {
    console.error('Error al actualizar el detalle de pedido:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar un detalle de pedido por TipoPedido, PedidoNumero y ProductoNumero
router.delete('/detallepedido/delete/:TipoPedido/:PedidoNumero/:ProductoNumero', verifyToken, async (req, res) => {
  try {
    const { TipoPedido, PedidoNumero, ProductoNumero } = req.params;
    const detallePedidoEliminado = await DetallePedido.destroy({ where: { TipoPedido, PedidoNumero, ProductoNumero } });
    res.status(200).json(detallePedidoEliminado);
  } catch (error) {
    console.error('Error al eliminar el detalle de pedido:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener todos los detalles de pedidos
router.get('/detallepedido/list', verifyToken, async (req, res) => {
  try {
    const detallesPedidos = await DetallePedido.findAll();
    res.json(detallesPedidos);
  } catch (error) {
    console.error('Error al obtener la lista de detalles de pedidos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener un detalle de pedido por TipoPedido, PedidoNumero y ProductoNumero
router.get('/detallepedido/:TipoPedido/:PedidoNumero/:ProductoNumero', verifyToken, async (req, res) => {
  try {
    const { TipoPedido, PedidoNumero, ProductoNumero } = req.params;
    const detallePedido = await DetallePedido.findOne({ where: { TipoPedido, PedidoNumero, ProductoNumero } });
    if (!detallePedido) {
      return res.status(404).send('Detalle de pedido no encontrado');
    }
    res.json(detallePedido);
  } catch (error) {
    console.error('Error al obtener el detalle de pedido por TipoPedido, PedidoNumero y ProductoNumero:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;

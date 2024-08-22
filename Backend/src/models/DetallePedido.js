const database = require('../database/database');
const { Sequelize, DataTypes } = require('sequelize');
const Pedido = require('./Pedido');
const Producto = require('./Producto');

const sequelize = new Sequelize(database.DB_NAME, database.DB_USER, database.DB_PASSWORD, {
  host: database.DB_HOST,
  port: database.DB_PORT,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Conexión establecida con la base de datos.'))
  .catch(error => console.error('Error al conectar con la base de datos: ', error));

const DetallePedido = sequelize.define('detalle_pedido', {
  TipoPedido: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true
  },
  PedidoNumero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  ProductoNumero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'ProductoNumero'
    }
  }
}, {
  freezeTableName: true
});

DetallePedido.belongsTo(Pedido, { foreignKey: 'TipoPedido', targetKey: 'TipoPedido' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'PedidoNumero', targetKey: 'PedidoNumero' });
DetallePedido.belongsTo(Producto, { foreignKey: 'ProductoNumero' });

sequelize.sync()
  .then(() => console.log('Tabla detalle_pedido creada'))
  .catch(error => console.error('Error', error));

module.exports = DetallePedido;
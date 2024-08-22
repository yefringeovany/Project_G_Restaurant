const database = require('../database/database');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(database.DB_NAME, database.DB_USER, database.DB_PASSWORD, {
  host: database.DB_HOST,
  port: database.DB_PORT,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Conexión establecida con la base de datos.'))
  .catch(error => console.error('Error al conectar con la base de datos: ', error));

const Pedido = sequelize.define('pedido', {
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
  FechaSolicitud: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Estado: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  freezeTableName: true
});

sequelize.sync()
  .then(() => console.log('Tabla pedido creada'))
  .catch(error => console.error('Error', error));

module.exports = Pedido;

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

const Producto = sequelize.define('producto', {
  ProductoNumero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ProductoDescripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  freezeTableName: true
});

sequelize.sync()
  .then(() => console.log('Tabla producto creada'))
  .catch(error => console.error('Error', error));

module.exports = Producto;
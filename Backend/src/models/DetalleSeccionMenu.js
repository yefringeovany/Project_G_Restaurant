const database = require('../database/database');
const { Sequelize, DataTypes } = require('sequelize');
const Menu = require('./Menu');
const SeccionMenu = require('./SeccionMenu');
const Producto = require('./Producto');

const sequelize = new Sequelize(database.DB_NAME, database.DB_USER, database.DB_PASSWORD, {
  host: database.DB_HOST,
  port: database.DB_PORT,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Conexión establecida con la base de datos.'))
  .catch(error => console.error('Error al conectar con la base de datos: ', error));

const DetalleSeccionMenu = sequelize.define('detalle_seccion_menu', {
  DetalleSeccionNumero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  MenuNumero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menu,
      key: 'id'
    }
  },
  SeccionMenuNumero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SeccionMenu,
      key: 'SeccionMenuNumero'
    }
  },
  ProductoNumero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'ProductoNumero'
    }
  },
  Precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  freezeTableName: true
});

DetalleSeccionMenu.belongsTo(Menu, { foreignKey: 'MenuNumero' });
DetalleSeccionMenu.belongsTo(SeccionMenu, { foreignKey: 'SeccionMenuNumero' });
DetalleSeccionMenu.belongsTo(Producto, { foreignKey: 'ProductoNumero' });

sequelize.sync()
  .then(() => console.log('Tabla detalle_seccion_menu creada'))
  .catch(error => console.error('Error', error));

module.exports = DetalleSeccionMenu;
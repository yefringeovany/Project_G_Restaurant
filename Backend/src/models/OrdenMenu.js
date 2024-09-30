// const database = require('../database/database');
require('dotenv').config(); // Cargar variables de entorno

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
  }
);

const Menu = require('./Menu');
const Orden = require('./Orden');

sequelize.authenticate()
  .then(() => console.log('Conexión establecida con la base de datos.'))
  .catch(error => console.error('Error al conectar con la base de datos: ', error));

const OrdenMenu = sequelize.define('orden_menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orden_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Orden,
      key: 'id'
    }
  },
  menu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menu,
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true
});

Orden.belongsToMany(Menu, { through: OrdenMenu, foreignKey: 'orden_id' });
Menu.belongsToMany(Orden, { through: OrdenMenu, foreignKey: 'menu_id' });

sequelize.sync()
  .then(() => console.log('Tabla orden_menu creada'))
  .catch(error => console.error('Error', error));

module.exports = OrdenMenu;
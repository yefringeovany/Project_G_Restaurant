const database = require('../database/database');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(database.DB_NAME, database.DB_USER, database.DB_PASSWORD, {
  host: database.DB_HOST,
  port: database.DB_PORT,
  dialect: 'mysql'
});

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
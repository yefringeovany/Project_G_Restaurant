const database = require('../database/database');
const { Sequelize, DataTypes } = require('sequelize');
const Menu = require('./Menu');

const sequelize = new Sequelize(database.DB_NAME, database.DB_USER, database.DB_PASSWORD, {
  host: database.DB_HOST,
  port: database.DB_PORT,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Conexión establecida con la base de datos.'))
  .catch(error => console.error('Error al conectar con la base de datos: ', error));

const SeccionMenu = sequelize.define('seccion_menu', {
  SeccionMenuNumero: {
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
  SeccionMenuDescripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  freezeTableName: true
});

SeccionMenu.belongsTo(Menu, { foreignKey: 'MenuNumero' });

sequelize.sync()
  .then(() => console.log('Tabla seccion_menu creada'))
  .catch(error => console.error('Error', error));

module.exports = SeccionMenu;
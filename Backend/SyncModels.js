const database = require('./src/database/database');
const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(database.DB_NAME, database.DB_USER, database.DB_PASSWORD, {
//   host: database.DB_HOST,
//   port: database.DB_PORT,
//   dialect: 'mysql'
// });

const Usuario = require('./src/models/Usuario');
const Categoria = require('./src/models/Categoria');
const Menu = require('./src/models/Menu');
const Orden = require('./src/models/Orden');
const OrdenMenu = require('./src/models/OrdenMenu');


sequelize.sync()
  .then(() => console.log(''))
  .catch(error => console.error('Error al crear las tablas: ', error));

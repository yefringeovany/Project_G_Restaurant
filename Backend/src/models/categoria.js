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

sequelize.authenticate()
  .then(() => console.log('Conexión establecida con la base de datos.'))
  .catch(error => console.error('Error al conectar con la base de datos: ', error));

const Categoria = sequelize.define('categoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
    allowNull: false
  }
}, {
  freezeTableName: true
});

sequelize.sync()
  .then(() => console.log('Tabla categoria creada'))
  .catch(error => console.error('Error', error));

module.exports = Categoria;
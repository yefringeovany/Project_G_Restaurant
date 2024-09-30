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
const Categoria = require('./Categoria');

sequelize.authenticate()
  .then(() => console.log('Conexión establecida con la base de datos.'))
  .catch(error => console.error('Error al conectar con la base de datos: ', error));

const Menu = sequelize.define('menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,
      key: 'id'
    }
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
  precio: {
    type: DataTypes.DECIMAL(10, 2),
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
  },
  imagen: { // Nueva columna para la imagen
    type: DataTypes.STRING(255), // Ajusta el tamaño según tus necesidades
    allowNull: true
  }
}, {
  freezeTableName: true
});

Menu.belongsTo(Categoria, { foreignKey: 'categoria_id' });

sequelize.sync()
  .then(() => console.log('Tabla menu creada'))
  .catch(error => console.error('Error', error));

module.exports = Menu;
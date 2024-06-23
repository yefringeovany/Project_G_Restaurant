const database = require('../database/database');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(database.DB_NAME, database.DB_USER, database.DB_PASSWORD, {
  host: database.DB_HOST,
  port: database.DB_PORT,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Conexión establecida con la base de datos.'))
  .catch(error => console.error('Error al conectar con la base de datos: ', error));

const Usuario = sequelize.define('usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  correo_electronico: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  contrasenia: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('SUPER_ADMINISTRADOR', 'ADMINISTRADOR', 'CHEF', 'MESERO'),
    allowNull: false
  }
}, {
  freezeTableName: true,
  hooks: {
    beforeCreate: async (usuario) => {
      const salt = await bcrypt.genSalt();
      usuario.contrasenia = await bcrypt.hash(usuario.contrasenia, salt);
    }
  }
});

sequelize.sync()
  .then(() => console.log('Tabla usuario creada'))
  .catch(error => console.error('Error', error));

module.exports = Usuario;

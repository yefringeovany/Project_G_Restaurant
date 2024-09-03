const database = require('../database/database');
const { Sequelize, DataTypes } = require('sequelize');
const Usuario = require('./Usuario'); // Importa el modelo Usuario

const sequelize = new Sequelize(database.DB_NAME, database.DB_USER, database.DB_PASSWORD, {
  host: database.DB_HOST,
  port: database.DB_PORT,
  dialect: 'mysql'
});

const Orden = sequelize.define('orden', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  monto_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  pagado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cambio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE, //cambiando a date
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'ENTREGADO', 'TERMINADO'),
    allowNull: false
  },
   usuario_id: { // Agrega la clave foránea para el usuario
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    },
    allowNull: false
  }
}, {
  freezeTableName: true
});

// Asociación con el modelo Usuario
Orden.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

sequelize.sync()
  .then(() => console.log('Tablas creadas'))
  .catch(error => console.error('Error', error));

module.exports = Orden;
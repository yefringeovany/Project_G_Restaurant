const database = require('../database/database');
const { Sequelize, DataTypes } = require('sequelize');

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
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'ENTREGADO'),
    allowNull: false
  }
}, {
  freezeTableName: true
});

sequelize.sync()
  .then(() => console.log('Tablas creadas'))
  .catch(error => console.error('Error', error));

module.exports = Orden;

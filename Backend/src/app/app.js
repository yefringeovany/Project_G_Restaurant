const logger = require('morgan');
const morgan = require('morgan');

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(logger('dev'));

app.use(require('../controllers/AuthController'));
app.use(require('../controllers/CategoriaController'));
app.use(require('../controllers/MenuController'));
app.use(require('../controllers/OrdenController'));
app.use(require('../controllers/CocinaController'));
app.use(require('../controllers/PedidoController'));
app.use(require('../controllers/ProductoController'));
app.use(require('../controllers/SeccionMenuController'));
app.use(require('../controllers/DetalleSeccionMenuController'));
app.use(require('../controllers/DetallePedidoController'));

module.exports = app;

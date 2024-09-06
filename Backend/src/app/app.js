const logger = require('morgan');
const morgan = require('morgan');
const path = require('path');

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));

app.use(require('../controllers/AuthController'));
app.use(require('../controllers/CategoriaController'));
app.use(require('../controllers/MenuController'));
app.use(require('../controllers/OrdenController'));
app.use(require('../controllers/CocinaController'));
// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;

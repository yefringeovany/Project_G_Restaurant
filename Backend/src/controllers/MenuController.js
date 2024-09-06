const { Router } = require('express');
const router = Router();

const Menu = require('../models/Menu');
const verifyToken = require('./VerifyToken');
const upload = require('../multer/multerConfig')

// Ruta para registrar un nuevo menú con imagen
router.post('/menu/register', verifyToken, upload.single('imagen'), async (req, res, next) => {
  try {
    const { categoria_id, nombre, descripcion, precio, estado } = req.body;
    const imagen = req.file ? req.file.filename : null; // Obtener el nombre del archivo cargado

    const nuevoMenu = await Menu.create({
      categoria_id,
      nombre,
      descripcion,
      precio,
      estado,
      imagen // Guardar el nombre del archivo en la base de datos
    });

    res.status(201).json(nuevoMenu);
  } catch (error) {
    console.error('Error al registrar nuevo menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para actualizar un menú
router.put('/menu/update/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoria_id, nombre, descripcion, precio, estado } = req.body;
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).send('Menú no encontrado');
    }
    const menuActualizado = await menu.update({
      categoria_id,
      nombre,
      descripcion,
      precio,
      estado
    });
    res.status(200).json(menuActualizado);
  } catch (error) {
    console.error('Error al actualizar menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para actualizar la imagen del menú
router.put('/menu/update/:id/imagen', verifyToken, upload.single('imagen'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const imagenPath = req.file ? req.file.path : null;

    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).send('Menú no encontrado');
    }

    menu.imagen = imagenPath;
    await menu.save();

    res.status(200).json({ message: 'Imagen actualizada con éxito', imagen: imagenPath });
  } catch (error) {
    console.error('Error al actualizar imagen del menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para eliminar un menú
router.delete('/menu/delete/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const menuEliminado = await Menu.destroy({ where: { id } });
    res.status(200).json(menuEliminado);
  } catch (error) {
    console.error('Error al eliminar menú:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener la lista de menús, incluyendo la imagen
router.get('/menu/list', verifyToken, async (req, res, next) => {
  try {
    const menus = await Menu.findAll({
      attributes: ['id', 'categoria_id', 'nombre', 'descripcion', 'precio', 'estado', 'imagen']
    });
    res.json(menus);
  } catch (error) {
    console.error('Error al obtener la lista de menús:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener un menú por ID
router.get('/menu/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).send('Menú no encontrado');
    }
    res.json(menu);
  } catch (error) {
    console.error('Error al obtener menú por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener menús por categoría
router.get('/menu/categoria/:categoria_id', verifyToken, async (req, res, next) => {
  try {
    const { categoria_id } = req.params;
    const menus = await Menu.findAll({
      where: { categoria_id }
    });
    res.json(menus);
  } catch (error) {
    console.error('Error al obtener la lista de menús por categoría:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;

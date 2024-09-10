const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Router } = require('express');
const router = Router();
const Usuario = require('../models/Usuario');
const verifyToken = require('./VerifyToken');
const { Op } = require('sequelize'); // Asegúrate de importar esto

router.post('/user/register', async (req, res, next) => {
  try {
    const { nombre, apellido, correo_electronico, contrasenia, rol } = req.body;
    const usuario = new Usuario({
      nombre: nombre,
      apellido: apellido,
      correo_electronico: correo_electronico,
      contrasenia: contrasenia,
      rol: rol
    });

    await usuario.save();

    const token = jwt.sign({
      id: usuario.id,
      rol: usuario.rol,
      nombre: usuario.nombre,
      apellido: usuario.apellido
    }, config.secret, {
      expiresIn: 60 * 60 * 24
    });

    res.json({
      auth: true,
      token: token
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para iniciar sesión
router.post('/user/login', async (req, res) => {
  try {
    const { correo_electronico, contrasenia } = req.body;
    console.log('Datos recibidos:', req.body); // Verificar datos

    const usuario = await Usuario.findOne({ where: { correo_electronico } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('Contraseña almacenada:', usuario.contrasenia); // Verificar contraseña almacenada

    // Verificar la contraseña
    const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    console.log('¿Contraseña válida?', contraseniaValida); // Verificar comparación
    if (!contraseniaValida) {
      return res.status(401).json({ auth: false, token: null, error: 'Contraseña incorrecta' });
    }

    // Crear un token si la contraseña es válida
    const token = jwt.sign({
      id: usuario.id,
      rol: usuario.rol,
      nombre: usuario.nombre,
      apellido: usuario.apellido
    }, config.secret, { expiresIn: 60 * 60 * 24 });

    res.json({ auth: true, token: token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener el perfil del usuario
router.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId, {
      attributes: { exclude: ['contrasenia'] }
    });
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para actualizar un usuario
router.put('/user/update/:id', verifyToken, async (req, res) => {
  try {
    const { nombre, apellido, correo_electronico, rol } = req.body;
    const { id } = req.params;

    // Validación básica
    if (!id || !nombre || !apellido || !correo_electronico || !rol) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Verificar si el usuario existe
    let usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Verificar si el correo electrónico ya está en uso por otro usuario
    const existingUser = await Usuario.findOne({ 
      where: { 
        correo_electronico, 
        id: { [Op.ne]: id } 
      } 
    });
    if (existingUser) {
      return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Actualizar usuario
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.correo_electronico = correo_electronico;
    usuario.rol = rol;

    await usuario.save(); // Usa save() en lugar de update() para asegurar la actualización

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});


// Ruta para eliminar un usuario
router.delete('/user/delete/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.destroy({
      where: { id }
    });
    res.status(200).json(usuarioEliminado);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener la lista de usuarios
router.get('/user/list', verifyToken, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contrasenia'] }
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener un usuario por ID
router.get('/user/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['contrasenia'] }
    });
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Router } = require('express');
const router = Router();

const Usuario = require('../models/Usuario');
const verifyToken = require('./VerifyToken');

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

router.post('/user/login', async (req, res, next) => {
  try {
    const { correo_electronico, contrasenia } = req.body;
    const usuario = await Usuario.findOne({
      where: {
        correo_electronico: correo_electronico
      }
    });
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    const contraseniaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!contraseniaValida) {
      return res.status(401).json({
        auth: false,
        token: null
      });
    }

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
    console.error('Error al iniciar sesion:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/user/profile', verifyToken, async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId, {
      attributes: { exclude: ['contrasenia'] }
    });
    if (!usuario) {
      return res.status(404).send('No user found');
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.put('/user/update/:id', verifyToken, async (req, res, next) => {
  try {
    const { nombre, apellido, correo_electronico, contrasenia, rol } = req.body;
    const { id } = req.params;
    let usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }
    if (contrasenia) {
      const salt = await bcrypt.genSalt();
      const hashedContrasenia = await bcrypt.hash(contrasenia, salt);
      await usuario.update({
        nombre,
        apellido,
        correo_electronico,
        contrasenia: hashedContrasenia,
        rol
      });
    } else {
      await usuario.update({
        nombre,
        apellido,
        correo_electronico,
        rol
      });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.delete('/user/delete/:id', verifyToken, async (req, res, next) => {
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

router.get('/user/list', verifyToken, async (req, res, next) => {
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

router.get('/user/:id', verifyToken, async (req, res, next) => {
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

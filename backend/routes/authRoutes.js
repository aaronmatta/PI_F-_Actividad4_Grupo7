const express = require('express');

const {
    registrarUsuario,
    iniciarSesion,
    recuperarContrasena
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('/recover-password', recuperarContrasena);

module.exports = router;
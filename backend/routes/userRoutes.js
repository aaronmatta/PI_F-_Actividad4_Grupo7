const express = require('express');

const {
    obtenerMiPerfil,
    actualizarMiPerfil,
    obtenerUsuarioPorRegistro
} = require('../controllers/userController');

const {
    verificarToken
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', verificarToken, obtenerMiPerfil);
router.put('/me', verificarToken, actualizarMiPerfil);
router.get('/registro/:registro_academico', verificarToken, obtenerUsuarioPorRegistro);

module.exports = router;
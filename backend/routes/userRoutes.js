const express = require('express');

const {
    obtenerMiPerfil,
    actualizarMiPerfil
} = require('../controllers/userController');

const {
    verificarToken
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', verificarToken, obtenerMiPerfil);
router.put('/me', verificarToken, actualizarMiPerfil);

module.exports = router;
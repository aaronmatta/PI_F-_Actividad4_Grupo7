const express = require('express');

const {
    obtenerMiPerfil
} = require('../controllers/userController');

const {
    verificarToken
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', verificarToken, obtenerMiPerfil);

module.exports = router;
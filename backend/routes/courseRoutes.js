const express = require('express');

const {
    obtenerCursos
} = require('../controllers/courseController');

const {
    verificarToken
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verificarToken, obtenerCursos);

module.exports = router;
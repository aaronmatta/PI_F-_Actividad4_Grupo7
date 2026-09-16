const express = require('express');

const {
    registrarUsuario,
    iniciarSesion
} = require('../controllers/authController');

const {
    verificarToken
} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);

router.get('/protegida', verificarToken, (req, res) => {
    res.json({
        mensaje: 'Acceso autorizado.',
        usuario: req.usuario
    });
});

module.exports = router;
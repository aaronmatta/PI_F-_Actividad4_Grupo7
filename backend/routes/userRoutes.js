const express = require('express');

const {
    obtenerMiPerfil,
    actualizarMiPerfil,
    obtenerUsuarioPorRegistro,
    agregarCursoAprobado,
    obtenerMisCursosAprobados,
    eliminarCursoAprobado,
    obtenerCursosUsuarioPorRegistro
} = require('../controllers/userController');

const {
    verificarToken
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', verificarToken, obtenerMiPerfil);
router.put('/me', verificarToken, actualizarMiPerfil);
router.get('/registro/:registro_academico', verificarToken, obtenerUsuarioPorRegistro);
router.post('/me/courses', verificarToken, agregarCursoAprobado);
router.get('/me/courses', verificarToken, obtenerMisCursosAprobados);
router.delete('/me/courses/:id_curso', verificarToken, eliminarCursoAprobado);
router.get('/registro/:registro_academico/courses', verificarToken, obtenerCursosUsuarioPorRegistro);

module.exports = router;
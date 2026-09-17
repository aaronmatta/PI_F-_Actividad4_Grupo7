const express = require('express');

const {
    crearPublicacion,
    obtenerPublicaciones,
    obtenerPublicacionPorId
} = require('../controllers/postController');

const {
    obtenerComentarios,
    crearComentario
} = require('../controllers/commentController');

const {
    verificarToken
} = require('../middleware/authMiddleware');


const router = express.Router();


router.get(
    '/',
    verificarToken,
    obtenerPublicaciones
);


router.post(
    '/',
    verificarToken,
    crearPublicacion
);


router.get(
    '/:id/comments',
    verificarToken,
    obtenerComentarios
);


router.post(
    '/:id/comments',
    verificarToken,
    crearComentario
);


router.get(
    '/:id',
    verificarToken,
    obtenerPublicacionPorId
);


module.exports = router;
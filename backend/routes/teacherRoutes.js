const express = require('express');

const {
    obtenerCatedraticos,
    obtenerCatedraticoPorId,
    crearCatedratico
} = require('../controllers/teacherController');

const {
    verificarToken
} = require('../middleware/authMiddleware');


const router = express.Router();


router.get(
    '/',
    verificarToken,
    obtenerCatedraticos
);


router.get(
    '/:id',
    verificarToken,
    obtenerCatedraticoPorId
);

router.post(
    '/',
    verificarToken,
    crearCatedratico
);

module.exports = router;
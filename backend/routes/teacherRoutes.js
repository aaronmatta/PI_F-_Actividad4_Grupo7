const express = require('express');

const {
    obtenerCatedraticos,
    obtenerCatedraticoPorId
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


module.exports = router;
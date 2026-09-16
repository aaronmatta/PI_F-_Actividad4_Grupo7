const pool = require('../config/db');

const obtenerCursos = async (req, res) => {
    try {
        const [cursos] = await pool.query(
            `SELECT
                id_curso,
                codigo,
                nombre,
                creditos,
                semestre
            FROM cursos
            ORDER BY semestre ASC, codigo ASC`
        );

        res.status(200).json({
            total: cursos.length,
            cursos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

module.exports = {
    obtenerCursos
};
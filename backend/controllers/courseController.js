const pool = require('../config/db');

const obtenerCursos = async (req, res) => {
    try {
        const {
            search,
            semestre
        } = req.query;

        let sql = `
            SELECT
                id_curso,
                codigo,
                nombre,
                creditos,
                semestre
            FROM cursos
            WHERE 1 = 1
        `;

        const parametros = [];

        if (search) {
            sql += `
                AND (
                    codigo LIKE ?
                    OR nombre LIKE ?
                )
            `;

            const busqueda = `%${search}%`;

            parametros.push(
                busqueda,
                busqueda
            );
        }

        if (semestre) {
            const numeroSemestre = Number(semestre);

            if (
                !Number.isInteger(numeroSemestre) ||
                numeroSemestre < 1 ||
                numeroSemestre > 10
            ) {
                return res.status(400).json({
                    mensaje: 'Semestre inválido'
                });
            }

            sql += `
                AND semestre = ?
            `;

            parametros.push(numeroSemestre);
        }

        sql += `
            ORDER BY semestre ASC, codigo ASC
        `;

        const [cursos] = await pool.query(
            sql,
            parametros
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
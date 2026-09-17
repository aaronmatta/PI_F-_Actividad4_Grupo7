const pool = require('../config/db');

const obtenerCatedraticos = async (req, res) => {
    try {
        const { search } = req.query;

        let sql = `
            SELECT
                id_catedratico,
                nombres,
                apellidos,
                fecha_creacion
            FROM catedraticos
        `;

        const parametros = [];

        if (search) {
            sql += `
                WHERE nombres LIKE ?
                OR apellidos LIKE ?
                OR CONCAT(nombres, ' ', apellidos) LIKE ?
            `;

            const busqueda = `%${search}%`;

            parametros.push(
                busqueda,
                busqueda,
                busqueda
            );
        }

        sql += `
            ORDER BY apellidos ASC, nombres ASC
        `;

        const [catedraticos] = await pool.query(
            sql,
            parametros
        );

        res.status(200).json({
            total: catedraticos.length,
            catedraticos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};


const obtenerCatedraticoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [catedraticos] = await pool.query(
            `SELECT
                id_catedratico,
                nombres,
                apellidos,
                fecha_creacion
            FROM catedraticos
            WHERE id_catedratico = ?`,
            [id]
        );

        if (catedraticos.length === 0) {
            return res.status(404).json({
                mensaje: 'Catedrático no encontrado'
            });
        }

        res.status(200).json({
            catedratico: catedraticos[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};


module.exports = {
    obtenerCatedraticos,
    obtenerCatedraticoPorId
};
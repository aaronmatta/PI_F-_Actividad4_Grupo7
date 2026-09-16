const pool = require('../config/db');

const obtenerMiPerfil = async (req, res) => {
    try {
        const idUsuario = req.usuario.id_usuario;

        const [usuarios] = await pool.query(
            `SELECT
                id_usuario,
                registro_academico,
                nombres,
                apellidos,
                correo_electronico,
                fecha_creacion,
                fecha_actualizacion
            FROM usuarios
            WHERE id_usuario = ?`,
            [idUsuario]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            usuario: usuarios[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

module.exports = {
    obtenerMiPerfil
};
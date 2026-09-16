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

const actualizarMiPerfil = async (req, res) => {
    try {
        const idUsuario = req.usuario.id_usuario;

        const {
            nombres,
            apellidos,
            correo_electronico
        } = req.body;

        // Verificar campos obligatorios
        if (!nombres || !apellidos || !correo_electronico) {
            return res.status(400).json({
                mensaje: 'Nombres, apellidos y correo electrónico son obligatorios'
            });
        }

        // Verificar si el correo ya pertenece a otro usuario
        const [correoExistente] = await pool.query(
            `SELECT id_usuario
            FROM usuarios
            WHERE correo_electronico = ?
            AND id_usuario <> ?`,
            [correo_electronico, idUsuario]
        );

        if (correoExistente.length > 0) {
            return res.status(400).json({
                mensaje: 'El correo electrónico ya está registrado'
            });
        }

        // Actualizar datos
        await pool.query(
            `UPDATE usuarios
            SET nombres = ?,
                apellidos = ?,
                correo_electronico = ?
            WHERE id_usuario = ?`,
            [
                nombres,
                apellidos,
                correo_electronico,
                idUsuario
            ]
        );

        // Obtener datos actualizados
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

        res.status(200).json({
            mensaje: 'Perfil actualizado correctamente',
            usuario: usuarios[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

const obtenerUsuarioPorRegistro = async (req, res) => {
    try {
        const { registro_academico } = req.params;

        const [usuarios] = await pool.query(
            `SELECT
                id_usuario,
                registro_academico,
                nombres,
                apellidos,
                fecha_creacion
            FROM usuarios
            WHERE registro_academico = ?`,
            [registro_academico]
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
    obtenerMiPerfil,
    actualizarMiPerfil,
    obtenerUsuarioPorRegistro
};
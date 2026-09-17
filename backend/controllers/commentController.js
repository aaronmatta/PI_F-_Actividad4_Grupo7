const pool = require('../config/db');


const obtenerComentarios = async (req, res) => {
    try {
        const { id } = req.params;

        const [publicaciones] =
            await pool.query(
                `SELECT id_publicacion
                FROM publicaciones
                WHERE id_publicacion = ?`,
                [id]
            );

        if (publicaciones.length === 0) {
            return res.status(404).json({
                mensaje:
                    'Publicación no encontrada'
            });
        }


        const [comentarios] =
            await pool.query(
                `SELECT
                    co.id_comentario,
                    co.comentario,
                    co.fecha_comentario,

                    u.id_usuario,
                    u.registro_academico,
                    u.nombres,
                    u.apellidos

                FROM comentarios co

                INNER JOIN usuarios u
                    ON co.id_usuario =
                        u.id_usuario

                WHERE co.id_publicacion = ?

                ORDER BY
                    co.fecha_comentario ASC`,
                [id]
            );


        const resultado =
            comentarios.map(
                comentario => ({
                    id_comentario:
                        comentario.id_comentario,

                    comentario:
                        comentario.comentario,

                    fecha_comentario:
                        comentario.fecha_comentario,

                    autor: {
                        id_usuario:
                            comentario.id_usuario,

                        registro_academico:
                            comentario.registro_academico,

                        nombres:
                            comentario.nombres,

                        apellidos:
                            comentario.apellidos
                    }
                })
            );


        res.status(200).json({
            total: resultado.length,
            comentarios: resultado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje:
                'Error interno del servidor'
        });
    }
};


const crearComentario = async (req, res) => {
    try {
        const { id } = req.params;

        const idUsuario =
            req.usuario.id_usuario;

        const { comentario } = req.body;


        if (
            !comentario ||
            !comentario.trim()
        ) {
            return res.status(400).json({
                mensaje:
                    'El comentario es obligatorio'
            });
        }


        const [publicaciones] =
            await pool.query(
                `SELECT id_publicacion
                FROM publicaciones
                WHERE id_publicacion = ?`,
                [id]
            );


        if (publicaciones.length === 0) {
            return res.status(404).json({
                mensaje:
                    'Publicación no encontrada'
            });
        }


        const [resultado] =
            await pool.query(
                `INSERT INTO comentarios
                (
                    id_publicacion,
                    id_usuario,
                    comentario
                )
                VALUES (?, ?, ?)`,
                [
                    id,
                    idUsuario,
                    comentario.trim()
                ]
            );


        const [comentarios] =
            await pool.query(
                `SELECT
                    co.id_comentario,
                    co.comentario,
                    co.fecha_comentario,

                    u.id_usuario,
                    u.registro_academico,
                    u.nombres,
                    u.apellidos

                FROM comentarios co

                INNER JOIN usuarios u
                    ON co.id_usuario =
                        u.id_usuario

                WHERE co.id_comentario = ?`,
                [resultado.insertId]
            );


        const nuevoComentario =
            comentarios[0];


        res.status(201).json({
            mensaje:
                'Comentario agregado correctamente',

            comentario: {
                id_comentario:
                    nuevoComentario.id_comentario,

                comentario:
                    nuevoComentario.comentario,

                fecha_comentario:
                    nuevoComentario.fecha_comentario,

                autor: {
                    id_usuario:
                        nuevoComentario.id_usuario,

                    registro_academico:
                        nuevoComentario.registro_academico,

                    nombres:
                        nuevoComentario.nombres,

                    apellidos:
                        nuevoComentario.apellidos
                }
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje:
                'Error interno del servidor'
        });
    }
};


module.exports = {
    obtenerComentarios,
    crearComentario
};
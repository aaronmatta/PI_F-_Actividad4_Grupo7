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

const agregarCursoAprobado = async (req, res) => {
    try {
        const idUsuario = req.usuario.id_usuario;
        const { id_curso } = req.body;

        // Verificar que se envió el curso
        if (!id_curso) {
            return res.status(400).json({
                mensaje: 'El curso es obligatorio'
            });
        }

        // Verificar que el curso exista
        const [cursos] = await pool.query(
            `SELECT
                id_curso,
                codigo,
                nombre,
                creditos,
                semestre
            FROM cursos
            WHERE id_curso = ?`,
            [id_curso]
        );

        if (cursos.length === 0) {
            return res.status(404).json({
                mensaje: 'Curso no encontrado'
            });
        }

        // Verificar que el usuario no lo haya agregado antes
        const [cursoAprobado] = await pool.query(
            `SELECT id_curso_aprobado
            FROM cursos_aprobados
            WHERE id_usuario = ?
            AND id_curso = ?`,
            [idUsuario, id_curso]
        );

        if (cursoAprobado.length > 0) {
            return res.status(400).json({
                mensaje: 'El curso ya fue agregado como aprobado'
            });
        }

        // Agregar curso aprobado
        await pool.query(
            `INSERT INTO cursos_aprobados
            (id_usuario, id_curso)
            VALUES (?, ?)`,
            [idUsuario, id_curso]
        );

        res.status(201).json({
            mensaje: 'Curso aprobado agregado correctamente',
            curso: cursos[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

const obtenerMisCursosAprobados = async (req, res) => {
    try {
        const idUsuario = req.usuario.id_usuario;

        const [cursos] = await pool.query(
            `SELECT
                c.id_curso,
                c.codigo,
                c.nombre,
                c.creditos,
                c.semestre,
                ca.fecha_agregado
            FROM cursos_aprobados ca
            INNER JOIN cursos c
                ON ca.id_curso = c.id_curso
            WHERE ca.id_usuario = ?
            ORDER BY c.semestre ASC, c.codigo ASC`,
            [idUsuario]
        );

        const totalCreditos = cursos.reduce(
            (total, curso) => total + curso.creditos,
            0
        );

        res.status(200).json({
            total_cursos: cursos.length,
            total_creditos: totalCreditos,
            cursos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

const eliminarCursoAprobado = async (req, res) => {
    try {
        const idUsuario = req.usuario.id_usuario;
        const { id_curso } = req.params;

        const [cursoAprobado] = await pool.query(
            `SELECT id_curso_aprobado
            FROM cursos_aprobados
            WHERE id_usuario = ?
            AND id_curso = ?`,
            [idUsuario, id_curso]
        );

        if (cursoAprobado.length === 0) {
            return res.status(404).json({
                mensaje: 'El curso no está registrado como aprobado'
            });
        }

        await pool.query(
            `DELETE FROM cursos_aprobados
            WHERE id_usuario = ?
            AND id_curso = ?`,
            [idUsuario, id_curso]
        );

        res.status(200).json({
            mensaje: 'Curso aprobado eliminado correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

const obtenerCursosUsuarioPorRegistro = async (req, res) => {
    try {
        const { registro_academico } = req.params;

        // Buscar usuario
        const [usuarios] = await pool.query(
            `SELECT
                id_usuario,
                registro_academico,
                nombres,
                apellidos
            FROM usuarios
            WHERE registro_academico = ?`,
            [registro_academico]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const usuario = usuarios[0];

        // Obtener sus cursos aprobados
        const [cursos] = await pool.query(
            `SELECT
                c.id_curso,
                c.codigo,
                c.nombre,
                c.creditos,
                c.semestre,
                ca.fecha_agregado
            FROM cursos_aprobados ca
            INNER JOIN cursos c
                ON ca.id_curso = c.id_curso
            WHERE ca.id_usuario = ?
            ORDER BY c.semestre ASC, c.codigo ASC`,
            [usuario.id_usuario]
        );

        const totalCreditos = cursos.reduce(
            (total, curso) => total + curso.creditos,
            0
        );

        res.status(200).json({
            usuario: {
                registro_academico: usuario.registro_academico,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos
            },
            total_cursos: cursos.length,
            total_creditos: totalCreditos,
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
    obtenerMiPerfil,
    actualizarMiPerfil,
    obtenerUsuarioPorRegistro,
    agregarCursoAprobado,
    obtenerMisCursosAprobados,
    eliminarCursoAprobado,
    obtenerCursosUsuarioPorRegistro
};
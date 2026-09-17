const pool = require('../config/db');


const formatearPublicacion = (publicacion) => {
    return {
        id_publicacion: publicacion.id_publicacion,
        tipo: publicacion.tipo,
        mensaje: publicacion.mensaje,
        fecha_publicacion: publicacion.fecha_publicacion,

        autor: {
            id_usuario: publicacion.id_usuario,
            registro_academico: publicacion.registro_academico,
            nombres: publicacion.autor_nombres,
            apellidos: publicacion.autor_apellidos
        },

        curso: publicacion.id_curso
            ? {
                id_curso: publicacion.id_curso,
                codigo: publicacion.curso_codigo,
                nombre: publicacion.curso_nombre,
                creditos: publicacion.curso_creditos,
                semestre: publicacion.curso_semestre
            }
            : null,

        catedratico: publicacion.id_catedratico
            ? {
                id_catedratico:
                    publicacion.id_catedratico,

                nombres:
                    publicacion.catedratico_nombres,

                apellidos:
                    publicacion.catedratico_apellidos
            }
            : null,

        total_comentarios:
            Number(publicacion.total_comentarios || 0)
    };
};


const consultarPublicacionPorId = async (idPublicacion) => {
    const [publicaciones] = await pool.query(
        `SELECT
            p.id_publicacion,
            p.tipo,
            p.mensaje,
            p.fecha_publicacion,

            u.id_usuario,
            u.registro_academico,
            u.nombres AS autor_nombres,
            u.apellidos AS autor_apellidos,

            c.id_curso,
            c.codigo AS curso_codigo,
            c.nombre AS curso_nombre,
            c.creditos AS curso_creditos,
            c.semestre AS curso_semestre,

            cat.id_catedratico,
            cat.nombres AS catedratico_nombres,
            cat.apellidos AS catedratico_apellidos,

            (
                SELECT COUNT(*)
                FROM comentarios co
                WHERE co.id_publicacion =
                    p.id_publicacion
            ) AS total_comentarios

        FROM publicaciones p

        INNER JOIN usuarios u
            ON p.id_usuario = u.id_usuario

        LEFT JOIN cursos c
            ON p.id_curso = c.id_curso

        LEFT JOIN catedraticos cat
            ON p.id_catedratico =
                cat.id_catedratico

        WHERE p.id_publicacion = ?`,
        [idPublicacion]
    );

    if (publicaciones.length === 0) {
        return null;
    }

    return formatearPublicacion(
        publicaciones[0]
    );
};


const crearPublicacion = async (req, res) => {
    try {
        const idUsuario =
            req.usuario.id_usuario;

        const {
            tipo,
            id_curso,
            id_catedratico,
            mensaje
        } = req.body;

        if (!tipo || !mensaje || !mensaje.trim()) {
            return res.status(400).json({
                mensaje:
                    'Tipo y mensaje son obligatorios'
            });
        }

        if (
            tipo !== 'curso' &&
            tipo !== 'catedratico'
        ) {
            return res.status(400).json({
                mensaje:
                    'El tipo debe ser curso o catedratico'
            });
        }

        let curso = null;
        let catedratico = null;

        if (tipo === 'curso') {
            if (!id_curso) {
                return res.status(400).json({
                    mensaje:
                        'Debe seleccionar un curso'
                });
            }

            if (id_catedratico) {
                return res.status(400).json({
                    mensaje:
                        'Una publicación de curso no puede tener catedrático'
                });
            }

            const [cursos] = await pool.query(
                `SELECT id_curso
                FROM cursos
                WHERE id_curso = ?`,
                [id_curso]
            );

            if (cursos.length === 0) {
                return res.status(404).json({
                    mensaje: 'Curso no encontrado'
                });
            }

            curso = id_curso;
        }


        if (tipo === 'catedratico') {
            if (!id_catedratico) {
                return res.status(400).json({
                    mensaje:
                        'Debe seleccionar un catedrático'
                });
            }

            if (id_curso) {
                return res.status(400).json({
                    mensaje:
                        'Una publicación de catedrático no puede tener curso'
                });
            }

            const [catedraticos] =
                await pool.query(
                    `SELECT id_catedratico
                    FROM catedraticos
                    WHERE id_catedratico = ?`,
                    [id_catedratico]
                );

            if (catedraticos.length === 0) {
                return res.status(404).json({
                    mensaje:
                        'Catedrático no encontrado'
                });
            }

            catedratico = id_catedratico;
        }


        const [resultado] = await pool.query(
            `INSERT INTO publicaciones
            (
                id_usuario,
                tipo,
                id_curso,
                id_catedratico,
                mensaje
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                idUsuario,
                tipo,
                curso,
                catedratico,
                mensaje.trim()
            ]
        );


        const publicacion =
            await consultarPublicacionPorId(
                resultado.insertId
            );


        res.status(201).json({
            mensaje:
                'Publicación creada correctamente',
            publicacion
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje:
                'Error interno del servidor'
        });
    }
};


const obtenerPublicaciones = async (req, res) => {
    try {
        const {
            tipo,
            id_curso,
            id_catedratico,
            search,
            orden
        } = req.query;


        if (
            tipo &&
            tipo !== 'curso' &&
            tipo !== 'catedratico'
        ) {
            return res.status(400).json({
                mensaje:
                    'Tipo de publicación inválido'
            });
        }


        let sql = `
            SELECT
                p.id_publicacion,
                p.tipo,
                p.mensaje,
                p.fecha_publicacion,

                u.id_usuario,
                u.registro_academico,
                u.nombres AS autor_nombres,
                u.apellidos AS autor_apellidos,

                c.id_curso,
                c.codigo AS curso_codigo,
                c.nombre AS curso_nombre,
                c.creditos AS curso_creditos,
                c.semestre AS curso_semestre,

                cat.id_catedratico,
                cat.nombres AS catedratico_nombres,
                cat.apellidos AS catedratico_apellidos,

                (
                    SELECT COUNT(*)
                    FROM comentarios co
                    WHERE co.id_publicacion =
                        p.id_publicacion
                ) AS total_comentarios

            FROM publicaciones p

            INNER JOIN usuarios u
                ON p.id_usuario = u.id_usuario

            LEFT JOIN cursos c
                ON p.id_curso = c.id_curso

            LEFT JOIN catedraticos cat
                ON p.id_catedratico =
                    cat.id_catedratico

            WHERE 1 = 1
        `;


        const parametros = [];


        if (tipo) {
            sql += `
                AND p.tipo = ?
            `;

            parametros.push(tipo);
        }


        if (id_curso) {
            sql += `
                AND p.id_curso = ?
            `;

            parametros.push(id_curso);
        }


        if (id_catedratico) {
            sql += `
                AND p.id_catedratico = ?
            `;

            parametros.push(id_catedratico);
        }


        if (search) {
            const busqueda = `%${search}%`;

            sql += `
                AND (
                    p.mensaje LIKE ?
                    OR c.codigo LIKE ?
                    OR c.nombre LIKE ?
                    OR cat.nombres LIKE ?
                    OR cat.apellidos LIKE ?
                    OR CONCAT(
                        cat.nombres,
                        ' ',
                        cat.apellidos
                    ) LIKE ?
                )
            `;

            parametros.push(
                busqueda,
                busqueda,
                busqueda,
                busqueda,
                busqueda,
                busqueda
            );
        }


        const ordenSQL =
            orden === 'asc'
                ? 'ASC'
                : 'DESC';


        sql += `
            ORDER BY p.fecha_publicacion
            ${ordenSQL}
        `;


        const [publicaciones] =
            await pool.query(
                sql,
                parametros
            );


        const resultado =
            publicaciones.map(
                formatearPublicacion
            );


        res.status(200).json({
            total: resultado.length,
            publicaciones: resultado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje:
                'Error interno del servidor'
        });
    }
};


const obtenerPublicacionPorId = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const publicacion =
            await consultarPublicacionPorId(id);

        if (!publicacion) {
            return res.status(404).json({
                mensaje:
                    'Publicación no encontrada'
            });
        }

        res.status(200).json({
            publicacion
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
    crearPublicacion,
    obtenerPublicaciones,
    obtenerPublicacionPorId
};
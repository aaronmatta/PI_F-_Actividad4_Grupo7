const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    try {
        const {
            registro_academico,
            nombres,
            apellidos,
            contrasena,
            correo_electronico
        } = req.body;

        // Verificar que todos los campos fueron enviados
        if (
            !registro_academico ||
            !nombres ||
            !apellidos ||
            !contrasena ||
            !correo_electronico
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si ya existe el registro académico
        const [usuarioRegistro] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE registro_academico = ?',
            [registro_academico]
        );

        if (usuarioRegistro.length > 0) {
            return res.status(400).json({
                mensaje: 'El registro académico ya está registrado'
            });
        }

        // Verificar si ya existe el correo electrónico
        const [usuarioCorreo] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE correo_electronico = ?',
            [correo_electronico]
        );

        if (usuarioCorreo.length > 0) {
            return res.status(400).json({
                mensaje: 'El correo electrónico ya está registrado'
            });
        }

        // Cifrar contraseña
        const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

        // Guardar usuario
        const [resultado] = await pool.query(
            `INSERT INTO usuarios
            (
                registro_academico,
                nombres,
                apellidos,
                contrasena,
                correo_electronico
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                registro_academico,
                nombres,
                apellidos,
                contrasenaCifrada,
                correo_electronico
            ]
        );

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: {
                id_usuario: resultado.insertId,
                registro_academico,
                nombres,
                apellidos,
                correo_electronico
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

const iniciarSesion = async (req, res) => {
    try {
        const {
            registro_academico,
            contrasena
        } = req.body;

        // Verificar campos obligatorios
        if (!registro_academico || !contrasena) {
            return res.status(400).json({
                mensaje: 'Registro académico y contraseña son obligatorios'
            });
        }

        // Buscar usuario
        const [usuarios] = await pool.query(
            'SELECT * FROM usuarios WHERE registro_academico = ?',
            [registro_academico]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const usuario = usuarios[0];

        // Comparar contraseña ingresada con contraseña cifrada
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if (!contrasenaCorrecta) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        // Crear token
        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                registro_academico: usuario.registro_academico
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                registro_academico: usuario.registro_academico,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                correo_electronico: usuario.correo_electronico
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};
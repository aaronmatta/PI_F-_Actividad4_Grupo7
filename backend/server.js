const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Backend Integrante funcionando'
    });
});

app.get('/prueba-db', async (req, res) => {
    try {
        const [resultado] = await pool.query(
            'SELECT * FROM usuarios'
        );

        res.json({
            mensaje: 'Consulta realizada correctamente',
            usuarios: resultado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar la base de datos',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        const connection = await pool.getConnection();

        console.log('Conexión a MySQL establecida correctamente');

        connection.release();

        app.listen(PORT, () => {
            console.log(
                `Servidor ejecutándose en http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error('Error al conectar con MySQL:');
        console.error(error.message);
    }
}

iniciarServidor();
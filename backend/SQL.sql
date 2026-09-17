-- =========================================================
-- BASE DE DATOS
-- =========================================================

CREATE DATABASE IF NOT EXISTS desarrollo_web
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE desarrollo_web;


-- =========================================================
-- TABLA: USUARIOS
-- =========================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,

    registro_academico VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL UNIQUE,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- TABLA: CURSOS
-- =========================================================

CREATE TABLE IF NOT EXISTS cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,

    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    creditos INT NOT NULL,
    semestre INT NOT NULL
);


-- =========================================================
-- TABLA: CURSOS APROBADOS
-- =========================================================

CREATE TABLE IF NOT EXISTS cursos_aprobados (
    id_curso_aprobado INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,

    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_curso_aprobado_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_curso_aprobado_curso
        FOREIGN KEY (id_curso)
        REFERENCES cursos(id_curso)
        ON DELETE CASCADE,

    CONSTRAINT unique_usuario_curso
        UNIQUE (id_usuario, id_curso)
);


-- =========================================================
-- TABLA: CATEDRATICOS
-- =========================================================

CREATE TABLE IF NOT EXISTS catedraticos (
    id_catedratico INT AUTO_INCREMENT PRIMARY KEY,

    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- TABLA: PUBLICACIONES
-- =========================================================

CREATE TABLE IF NOT EXISTS publicaciones (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,

    tipo ENUM('curso', 'catedratico') NOT NULL,

    id_curso INT NULL,
    id_catedratico INT NULL,

    mensaje TEXT NOT NULL,

    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_publicacion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_publicacion_curso
        FOREIGN KEY (id_curso)
        REFERENCES cursos(id_curso)
        ON DELETE CASCADE,

    CONSTRAINT fk_publicacion_catedratico
        FOREIGN KEY (id_catedratico)
        REFERENCES catedraticos(id_catedratico)
        ON DELETE CASCADE
);


-- =========================================================
-- TABLA: COMENTARIOS
-- =========================================================

CREATE TABLE IF NOT EXISTS comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,

    id_publicacion INT NOT NULL,
    id_usuario INT NOT NULL,

    comentario TEXT NOT NULL,

    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comentario_publicacion
        FOREIGN KEY (id_publicacion)
        REFERENCES publicaciones(id_publicacion)
        ON DELETE CASCADE,

    CONSTRAINT fk_comentario_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);


-- =========================================================
-- ÍNDICES
-- =========================================================

CREATE INDEX idx_publicaciones_fecha
ON publicaciones(fecha_publicacion);

CREATE INDEX idx_publicaciones_curso
ON publicaciones(id_curso);

CREATE INDEX idx_publicaciones_catedratico
ON publicaciones(id_catedratico);

CREATE INDEX idx_comentarios_publicacion
ON comentarios(id_publicacion);


-- =========================================================
-- CATÁLOGO DE CURSOS
-- =========================================================

INSERT INTO cursos (
    codigo,
    nombre,
    creditos,
    semestre
)
VALUES

-- =========================================================
-- PRIMER SEMESTRE
-- =========================================================

('0005', 'Técnicas de Estudio e Investigación', 3, 1),
('0017', 'Área Social Humanística 1', 3, 1),
('0101', 'Área Matemática Básica 1', 9, 1),
('0006', 'Idioma Técnico 1', 3, 1),
('0039', 'Deportes 1', 2, 1),


-- =========================================================
-- SEGUNDO SEMESTRE
-- =========================================================

('0019', 'Área Social Humanística 2', 3, 2),
('0103', 'Área Matemática Básica 2', 9, 2),
('0147', 'Física Básica', 5, 2),
('0960', 'Matemática para Computación 1', 5, 2),
('0008', 'Idioma Técnico 2', 3, 2),
('0040', 'Deportes 2', 2, 2),


-- =========================================================
-- TERCER SEMESTRE
-- =========================================================

('0107', 'Área Matemática Intermedia 1', 9, 3),
('0150', 'Física 1', 5, 3),
('0770', 'Introducción a la Programación y Computación 1', 6, 3),
('0795', 'Lógica de Sistemas', 3, 3),
('0962', 'Matemática para Computación 2', 5, 3),
('0001', 'Ética Profesional', 2, 3),
('0009', 'Idioma Técnico 3', 3, 3),


-- =========================================================
-- CUARTO SEMESTRE
-- =========================================================

('0112', 'Área Matemática Intermedia 2', 6, 4),
('0114', 'Área Matemática Intermedia 3', 6, 4),
('0152', 'Física 2', 6, 4),
('0771', 'Introducción a la Programación y Computación 2', 6, 4),
('0796', 'Lenguajes Formales y de Programación', 4, 4),
('2025', 'Prácticas Iniciales', 0, 4),
('0010', 'Lógica', 1, 4),
('0011', 'Idioma Técnico 4', 3, 4),


-- =========================================================
-- QUINTO SEMESTRE
-- =========================================================

('0116', 'Matemática Aplicada 3', 5, 5),
('0118', 'Matemática Aplicada 1', 5, 5),
('0732', 'Estadística 1', 5, 5),
('0772', 'Estructuras de Datos', 6, 5),
('0777', 'Organización de Lenguajes y Compiladores 1', 6, 5),
('0964', 'Organización Computacional', 4, 5),
('0018', 'Filosofía de la Ciencia', 1, 5),


-- =========================================================
-- SEXTO SEMESTRE
-- =========================================================

('0014', 'Economía', 3, 6),
('0601', 'Investigación de Operaciones I', 6, 6),
('0722', 'Teoría de Sistemas 1', 4, 6),
('0773', 'Manejo e Implementación de Archivos', 5, 6),
('0778', 'Arquitectura de Computadores y Ensambladores 1', 5, 6),
('0781', 'Organización de Lenguajes y Compiladores 2', 6, 6),
('0120', 'Matemática Aplicada 2', 5, 6),
('0122', 'Matemática Aplicada 4', 5, 6),
('0200', 'Ingeniería Eléctrica 1', 6, 6),


-- =========================================================
-- SÉPTIMO SEMESTRE
-- =========================================================

('0281', 'Sistemas Operativos 1', 6, 7),
('0603', 'Investigación de Operaciones II', 6, 7),
('0724', 'Teoría de Sistemas 2', 4, 7),
('0774', 'Sistemas de Bases de Datos 1', 6, 7),
('0779', 'Arquitectura de Computadores y Ensambladores 2', 5, 7),
('0970', 'Redes de Computadoras 1', 5, 7),
('2036', 'Prácticas Intermedias', 0, 7),
('0734', 'Estadística 2', 5, 7),


-- =========================================================
-- OCTAVO SEMESTRE
-- =========================================================

('0283', 'Análisis y Diseño de Sistemas 1', 6, 8),
('0285', 'Sistemas Operativos 2', 4, 8),
('0775', 'Sistemas de Bases de Datos 2', 7, 8),
('0797', 'Seminario de Sistemas I', 5, 8),
('0975', 'Redes de Computadoras 2', 6, 8),
('0700', 'Ingeniería Económica 1', 4, 8),


-- =========================================================
-- NOVENO SEMESTRE
-- =========================================================

('0729', 'Modelación y Simulación 1', 5, 9),
('0785', 'Análisis y Diseño de Sistemas 2', 7, 9),
('0786', 'Sistemas Organizacionales y Gerenciales 1', 5, 9),
('0798', 'Seminario de Sistemas 2', 5, 9),
('0972', 'Inteligencia Artificial 1', 7, 9),
('2009', 'Prácticas Finales Ingeniería Ciencias y Sistemas', 0, 9),
('0776', 'Bases de Datos Avanzadas', 5, 9),
('0788', 'Sistemas Aplicados 1', 5, 9),
('0966', 'Seguridad y Auditoría de Redes de Computadoras', 3, 9),


-- =========================================================
-- DÉCIMO SEMESTRE
-- =========================================================

('0720', 'Modelación y Simulación 2', 6, 10),
('0780', 'Software Avanzado', 8, 10),
('0787', 'Sistemas Organizacionales y Gerenciales 2', 6, 10),
('0799', 'Seminario de Investigación', 3, 10),
('0735', 'Auditoría de Proyectos de Software', 6, 10),
('0789', 'Sistemas Aplicados 2', 5, 10),
('0790', 'Emprendedores de Negocios Informáticos', 6, 10),
('0968', 'Inteligencia Artificial 2', 5, 10),
('0974', 'Redes de Nueva Generación', 3, 10),
('7999', 'Seminario de Investigación E.P.S. Sistemas', 3, 10)

ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    creditos = VALUES(creditos),
    semestre = VALUES(semestre);

SHOW TABLES;

SELECT COUNT(*) AS total_cursos
FROM cursos;

SELECT * FROM usuarios;

SELECT * FROM cursos;

SELECT * FROM cursos_aprobados;

SELECT * FROM catedraticos;

SELECT * FROM publicaciones;

SELECT * FROM comentarios;
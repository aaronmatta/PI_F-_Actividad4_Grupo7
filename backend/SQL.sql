CREATE DATABASE desarrollo_web;
USE desarrollo_web;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    registro_academico VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    creditos INT NOT NULL
);
ALTER TABLE cursos ADD COLUMN semestre INT NOT NULL AFTER creditos;

CREATE TABLE cursos_aprobados (
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

INSERT INTO cursos
(codigo, nombre, creditos, semestre)
VALUES
('0116', 'Matemática Aplicada 3', 5, 5),
('0118', 'Matemática Aplicada 1', 5, 5),
('0732', 'Estadística 1', 5, 5),
('0772', 'Estructuras de Datos', 6, 5),
('0777', 'Organización de Lenguajes y Compiladores 1', 6, 5),
('0964', 'Organización Computacional', 4, 5);

select * from usuarios;
select * from cursos;
show tables;
describe usuarios;
describe cursos;
describe cursos_aprobados;
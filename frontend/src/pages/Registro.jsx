import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/authService';
import './Login.css';

function Registro() {
  const navigate = useNavigate();

  const [registroAcademico, setRegistroAcademico] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [errorServidor, setErrorServidor] = useState('');
  const [cargando, setCargando] = useState(false);

  const validarCorreo = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nuevosErrores = {};

    if (!registroAcademico.trim()) {
      nuevosErrores.registroAcademico =
        'Ingrese su registro académico';
    }

    if (!nombres.trim()) {
      nuevosErrores.nombres =
        'Ingrese sus nombres';
    }

    if (!apellidos.trim()) {
      nuevosErrores.apellidos =
        'Ingrese sus apellidos';
    }

    if (!correoElectronico.trim()) {
      nuevosErrores.correoElectronico =
        'Ingrese su correo electrónico';
    } else if (!validarCorreo(correoElectronico)) {
      nuevosErrores.correoElectronico =
        'Ingrese un correo electrónico válido';
    }

    if (!contrasena) {
      nuevosErrores.contrasena =
        'Ingrese una contraseña';
    }

    if (!confirmarContrasena) {
      nuevosErrores.confirmarContrasena =
        'Confirme su contraseña';
    } else if (contrasena !== confirmarContrasena) {
      nuevosErrores.confirmarContrasena =
        'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    setMensaje('');
    setErrorServidor('');

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {
      setCargando(true);

      const respuesta = await registrarUsuario({
        registro_academico: registroAcademico.trim(),
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        contrasena: contrasena,
        correo_electronico: correoElectronico.trim(),
      });

      setMensaje(respuesta.mensaje);

      setRegistroAcademico('');
      setNombres('');
      setApellidos('');
      setCorreoElectronico('');
      setContrasena('');
      setConfirmarContrasena('');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setErrorServidor(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <div className="university-icon">FI</div>

          <div>
            <p className="university-name">
              Universidad de San Carlos de Guatemala
            </p>

            <p className="faculty-name">
              Facultad de Ingeniería
            </p>
          </div>
        </div>

        <div className="auth-content">
          <h1>Crear cuenta</h1>

          <p className="auth-description">
            Completa tus datos para registrarte en el foro académico.
          </p>

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label htmlFor="registroAcademico">
                Registro académico
              </label>

              <input
                id="registroAcademico"
                type="text"
                placeholder="Ej. 202300000"
                value={registroAcademico}
                onChange={(event) =>
                  setRegistroAcademico(event.target.value)
                }
                className={
                  errores.registroAcademico ? 'input-error' : ''
                }
                disabled={cargando}
              />

              {errores.registroAcademico && (
                <span className="error-message">
                  {errores.registroAcademico}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nombres">
                Nombres
              </label>

              <input
                id="nombres"
                type="text"
                placeholder="Ingresa tus nombres"
                value={nombres}
                onChange={(event) =>
                  setNombres(event.target.value)
                }
                className={
                  errores.nombres ? 'input-error' : ''
                }
                disabled={cargando}
              />

              {errores.nombres && (
                <span className="error-message">
                  {errores.nombres}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">
                Apellidos
              </label>

              <input
                id="apellidos"
                type="text"
                placeholder="Ingresa tus apellidos"
                value={apellidos}
                onChange={(event) =>
                  setApellidos(event.target.value)
                }
                className={
                  errores.apellidos ? 'input-error' : ''
                }
                disabled={cargando}
              />

              {errores.apellidos && (
                <span className="error-message">
                  {errores.apellidos}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="correoElectronico">
                Correo electrónico
              </label>

              <input
                id="correoElectronico"
                type="email"
                placeholder="ejemplo@correo.com"
                value={correoElectronico}
                onChange={(event) =>
                  setCorreoElectronico(event.target.value)
                }
                className={
                  errores.correoElectronico ? 'input-error' : ''
                }
                disabled={cargando}
              />

              {errores.correoElectronico && (
                <span className="error-message">
                  {errores.correoElectronico}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contrasena">
                Contraseña
              </label>

              <input
                id="contrasena"
                type="password"
                placeholder="Ingresa una contraseña"
                value={contrasena}
                onChange={(event) =>
                  setContrasena(event.target.value)
                }
                className={
                  errores.contrasena ? 'input-error' : ''
                }
                disabled={cargando}
              />

              {errores.contrasena && (
                <span className="error-message">
                  {errores.contrasena}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">
                Confirmar contraseña
              </label>

              <input
                id="confirmarContrasena"
                type="password"
                placeholder="Vuelve a escribir la contraseña"
                value={confirmarContrasena}
                onChange={(event) =>
                  setConfirmarContrasena(event.target.value)
                }
                className={
                  errores.confirmarContrasena ? 'input-error' : ''
                }
                disabled={cargando}
              />

              {errores.confirmarContrasena && (
                <span className="error-message">
                  {errores.confirmarContrasena}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={cargando}
            >
              {cargando ? 'Registrando...' : 'Registrarse'}
            </button>

            {mensaje && (
              <div className="success-message">
                {mensaje}
              </div>
            )}

            {errorServidor && (
              <div className="server-error-message">
                {errorServidor}
              </div>
            )}
          </form>

          <div className="register-section">
            <span>¿Ya tienes una cuenta?</span>

            <Link
              to="/login"
              className="text-link"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Registro;
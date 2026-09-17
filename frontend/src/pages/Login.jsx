import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/authService';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const registroGuardado =
    localStorage.getItem('registro_recordado') || '';

  const [registroAcademico, setRegistroAcademico] =
    useState(registroGuardado);

  const [contrasena, setContrasena] =
    useState('');

  const [recordarUsuario, setRecordarUsuario] =
    useState(Boolean(registroGuardado));

  const [errores, setErrores] =
    useState({});

  const [mensaje, setMensaje] =
    useState('');

  const [errorServidor, setErrorServidor] =
    useState('');

  const [cargando, setCargando] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nuevosErrores = {};

    if (!registroAcademico.trim()) {
      nuevosErrores.registroAcademico =
        'Ingrese su registro académico';
    }

    if (!contrasena) {
      nuevosErrores.contrasena =
        'Ingrese su contraseña';
    }

    setErrores(nuevosErrores);
    setMensaje('');
    setErrorServidor('');

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    try {
      setCargando(true);

      const respuesta = await iniciarSesion({
        registro_academico:
          registroAcademico.trim(),

        contrasena:
          contrasena,
      });

      /*
        Guardamos el token que devuelve el backend.
        Lo necesitaremos para acceder a funciones
        protegidas del sistema.
      */
      localStorage.setItem(
        'token',
        respuesta.token
      );

      /*
        Guardamos también información básica
        del usuario que inició sesión.
      */
      localStorage.setItem(
        'usuario',
        JSON.stringify(respuesta.usuario)
      );

      /*
        Si el usuario marcó "Recordar usuario",
        guardamos únicamente el registro académico.
      */
      if (recordarUsuario) {
        localStorage.setItem(
          'registro_recordado',
          registroAcademico.trim()
        );
      } else {
        localStorage.removeItem(
          'registro_recordado'
        );
      }

      setMensaje(respuesta.mensaje);
      setContrasena('');

      setTimeout(() => {
        navigate('/inicio');
      }, 1000);

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

          <div className="university-icon">
            FI
          </div>

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

          <h1>
            Iniciar sesión
          </h1>

          <p className="auth-description">
            Ingresa tus datos para acceder
            al foro académico.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
          >

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
                  setRegistroAcademico(
                    event.target.value
                  )
                }

                className={
                  errores.registroAcademico
                    ? 'input-error'
                    : ''
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

              <label htmlFor="contrasena">
                Contraseña
              </label>

              <input
                id="contrasena"
                type="password"
                placeholder="Ingresa tu contraseña"

                value={contrasena}

                onChange={(event) =>
                  setContrasena(
                    event.target.value
                  )
                }

                className={
                  errores.contrasena
                    ? 'input-error'
                    : ''
                }

                disabled={cargando}
              />

              {errores.contrasena && (
                <span className="error-message">
                  {errores.contrasena}
                </span>
              )}

            </div>

            <div className="form-options">

              <label className="remember-option">

                <input
                  type="checkbox"

                  checked={recordarUsuario}

                  onChange={(event) =>
                    setRecordarUsuario(
                      event.target.checked
                    )
                  }
                />

                Recordar usuario

              </label>

              <Link
                to="/recuperar-contrasena"
                className="text-link"
              >
                ¿Olvidó su contraseña?
              </Link>

            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={cargando}
            >
              {
                cargando
                  ? 'Iniciando sesión...'
                  : 'Iniciar sesión'
              }
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

            <span>
              ¿No tienes una cuenta?
            </span>

            <Link
              to="/registro"
              className="text-link"
            >
              Registrarse
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;
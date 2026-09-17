import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [registroAcademico, setRegistroAcademico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordarUsuario, setRecordarUsuario] = useState(false);

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (event) => {
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

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setMensaje(
      'Datos válidos. La conexión con el servidor se realizará en el siguiente paso.'
    );
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
          <h1>Iniciar sesión</h1>

          <p className="auth-description">
            Ingresa tus datos para acceder al foro académico.
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
                  setContrasena(event.target.value)
                }
                className={
                  errores.contrasena ? 'input-error' : ''
                }
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
                    setRecordarUsuario(event.target.checked)
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
            >
              Iniciar sesión
            </button>

            {mensaje && (
              <div className="success-message">
                {mensaje}
              </div>
            )}
          </form>

          <div className="register-section">
            <span>¿No tienes una cuenta?</span>

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


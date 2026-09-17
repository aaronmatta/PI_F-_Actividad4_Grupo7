import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function RecuperarContrasena() {
  const [registroAcademico, setRegistroAcademico] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  const validarCorreo = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nuevosErrores = {};

    if (!registroAcademico.trim()) {
      nuevosErrores.registroAcademico =
        'Ingrese su registro académico';
    }

    if (!correoElectronico.trim()) {
      nuevosErrores.correoElectronico =
        'Ingrese su correo electrónico';
    } else if (!validarCorreo(correoElectronico)) {
      nuevosErrores.correoElectronico =
        'Ingrese un correo electrónico válido';
    }

    if (!nuevaContrasena) {
      nuevosErrores.nuevaContrasena =
        'Ingrese una nueva contraseña';
    }

    if (!confirmarContrasena) {
      nuevosErrores.confirmarContrasena =
        'Confirme la nueva contraseña';
    } else if (nuevaContrasena !== confirmarContrasena) {
      nuevosErrores.confirmarContrasena =
        'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    setMensaje('');

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setMensaje(
      'Datos válidos. La recuperación se conectará al servidor en el siguiente paso.'
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
          <h1>Recuperar contraseña</h1>

          <p className="auth-description">
            Verifica tus datos y establece una nueva contraseña.
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
                  errores.registroAcademico
                    ? 'input-error'
                    : ''
                }
              />

              {errores.registroAcademico && (
                <span className="error-message">
                  {errores.registroAcademico}
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
                  errores.correoElectronico
                    ? 'input-error'
                    : ''
                }
              />

              {errores.correoElectronico && (
                <span className="error-message">
                  {errores.correoElectronico}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nuevaContrasena">
                Nueva contraseña
              </label>

              <input
                id="nuevaContrasena"
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                value={nuevaContrasena}
                onChange={(event) =>
                  setNuevaContrasena(event.target.value)
                }
                className={
                  errores.nuevaContrasena
                    ? 'input-error'
                    : ''
                }
              />

              {errores.nuevaContrasena && (
                <span className="error-message">
                  {errores.nuevaContrasena}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">
                Confirmar nueva contraseña
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
                  errores.confirmarContrasena
                    ? 'input-error'
                    : ''
                }
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
            >
              Actualizar contraseña
            </button>

            {mensaje && (
              <div className="success-message">
                {mensaje}
              </div>
            )}
          </form>

          <div className="register-section">
            <Link
              to="/login"
              className="text-link"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RecuperarContrasena;
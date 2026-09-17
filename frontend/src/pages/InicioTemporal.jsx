import {
  Navigate,
  useNavigate
} from 'react-router-dom';

import './Login.css';

function InicioTemporal() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem('token');

  const usuarioGuardado =
    localStorage.getItem('usuario');

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  let usuario = null;

  if (usuarioGuardado) {
    usuario = JSON.parse(
      usuarioGuardado
    );
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/login');
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
            Sesión iniciada
          </h1>

          <p className="auth-description">
            Bienvenido
            {usuario?.nombres
              ? `, ${usuario.nombres}`
              : ''}.
          </p>

          <div className="success-message">
            Autenticación realizada correctamente.
          </div>

          <p className="auth-description">
            Esta pantalla es temporal.
            Aquí se conectará posteriormente
            la pantalla principal desarrollada
            por el Integrante 4.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </div>

      </section>

    </main>
  );
}

export default InicioTemporal;
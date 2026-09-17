import { Link } from 'react-router-dom';
import './Login.css';

function Registro() {
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
          <h1>Registro</h1>

          <p className="auth-description">
            Formulario de creación de usuario.
          </p>

          <Link to="/login" className="text-link">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Registro;
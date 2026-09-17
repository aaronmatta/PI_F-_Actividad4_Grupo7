import { useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const usuarioGuardado = localStorage.getItem('usuario');

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
    try {
      usuario = JSON.parse(usuarioGuardado);
    } catch {
      usuario = null;
    }
  }

  /*
    Estas publicaciones son únicamente datos de prueba.
    Más adelante serán reemplazadas por información
    obtenida desde el backend.
  */
  const publicaciones = useMemo(() => [
    {
      id: 1,
      usuario: 'Carlos López',
      curso: 'Sistemas Operativos 1',
      catedratico: 'Ing. Juan Pérez',
      mensaje:
        '¿Qué tal es el curso y qué recomendaciones tienen para llevarlo?',
      fecha: '2026-09-16T20:30:00',
    },
    {
      id: 2,
      usuario: 'Andrea Morales',
      curso: 'Bases de Datos 1',
      catedratico: 'Ing. María González',
      mensaje:
        'El curso requiere bastante práctica. Recomiendo llevar al día los laboratorios.',
      fecha: '2026-09-16T18:10:00',
    },
    {
      id: 3,
      usuario: 'Luis Hernández',
      curso: 'Lenguajes Formales',
      catedratico: 'Ing. Roberto Castillo',
      mensaje:
        '¿Alguien ha llevado este curso con este catedrático? Me gustaría conocer opiniones.',
      fecha: '2026-09-15T21:45:00',
    },
    {
      id: 4,
      usuario: 'María García',
      curso: 'Introducción a la Programación 2',
      catedratico: 'Ing. Ana Ramírez',
      mensaje:
        'Muy importante practicar bastante estructuras de datos y programación.',
      fecha: '2026-09-14T15:20:00',
    },
  ], []);

  /*
    Ordenamos por fecha:
    publicación más reciente primero.
  */
  const publicacionesOrdenadas = [...publicaciones].sort(
    (a, b) =>
      new Date(b.fecha) - new Date(a.fecha)
  );

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/login');
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString(
      'es-GT',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    );
  };

  return (
    <div className="inicio-page">

      <header className="inicio-header">

        <div className="header-brand">
          <div className="header-logo">
            FI
          </div>

          <div>
            <h1>
              Foro Ingeniería
            </h1>

            <p>
              Facultad de Ingeniería - USAC
            </p>
          </div>
        </div>

        <div className="header-user">

          <span>
            {usuario?.nombres
              ? `Hola, ${usuario.nombres}`
              : 'Usuario'}
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </div>

      </header>

      <main className="inicio-container">

        <section className="inicio-intro">

          <div>
            <h2>
              Publicaciones recientes
            </h2>

            <p>
              Consulta opiniones sobre cursos y
              catedráticos de la Facultad de Ingeniería.
            </p>
          </div>

        </section>

        <section className="feed">

          {publicacionesOrdenadas.map(
            (publicacion) => (

              <article
                className="publicacion-card"
                key={publicacion.id}
              >

                <div className="publicacion-header">

                  <div className="avatar">
                    {publicacion.usuario
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3>
                      {publicacion.usuario}
                    </h3>

                    <span className="fecha-publicacion">
                      {formatearFecha(
                        publicacion.fecha
                      )}
                    </span>
                  </div>

                </div>

                <div className="publicacion-tags">

                  <span className="tag">
                    {publicacion.curso}
                  </span>

                  <span className="tag tag-secondary">
                    {publicacion.catedratico}
                  </span>

                </div>

                <p className="publicacion-mensaje">
                  {publicacion.mensaje}
                </p>

                <div className="publicacion-footer">

                  <span>
                    💬 Ver comentarios
                  </span>

                </div>

              </article>

            )
          )}

        </section>

      </main>

    </div>
  );
}

export default Inicio;
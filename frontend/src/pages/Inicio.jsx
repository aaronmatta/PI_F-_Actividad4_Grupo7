import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const usuarioGuardado = localStorage.getItem('usuario');

  const [busqueda, setBusqueda] = useState('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [catedraticoSeleccionado, setCatedraticoSeleccionado] =
    useState('');
  const [nombreCurso, setNombreCurso] = useState('');
  const [nombreCatedratico, setNombreCatedratico] = useState('');


  let usuario = null;

  if (usuarioGuardado) {
    try {
      usuario = JSON.parse(usuarioGuardado);
    } catch {
      usuario = null;
    }
  }

  /*
    Datos temporales.
    Más adelante serán obtenidos desde el backend.
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
    Obtenemos los cursos disponibles
    sin repetir nombres.
  */
  const cursos = useMemo(() => {
    return [
      ...new Set(
        publicaciones.map(
          (publicacion) => publicacion.curso
        )
      ),
    ];
  }, [publicaciones]);

  /*
    Obtenemos los catedráticos disponibles
    sin repetir nombres.
  */
  const catedraticos = useMemo(() => {
    return [
      ...new Set(
        publicaciones.map(
          (publicacion) => publicacion.catedratico
        )
      ),
    ];
  }, [publicaciones]);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
       />
      );
    }

  /*
    Aplicamos todos los filtros.
  */
  const publicacionesFiltradas = publicaciones
    .filter((publicacion) => {
      const textoBusqueda =
        busqueda.trim().toLowerCase();

      const coincideBusqueda =
        !textoBusqueda ||
        publicacion.mensaje
          .toLowerCase()
          .includes(textoBusqueda) ||
        publicacion.curso
          .toLowerCase()
          .includes(textoBusqueda) ||
        publicacion.catedratico
          .toLowerCase()
          .includes(textoBusqueda) ||
        publicacion.usuario
          .toLowerCase()
          .includes(textoBusqueda);

      const coincideCurso =
        !cursoSeleccionado ||
        publicacion.curso === cursoSeleccionado;

      const coincideCatedratico =
        !catedraticoSeleccionado ||
        publicacion.catedratico ===
          catedraticoSeleccionado;

      const coincideNombreCurso =
        !nombreCurso.trim() ||
        publicacion.curso
          .toLowerCase()
          .includes(
            nombreCurso.trim().toLowerCase()
          );

      const coincideNombreCatedratico =
        !nombreCatedratico.trim() ||
        publicacion.catedratico
          .toLowerCase()
          .includes(
            nombreCatedratico
              .trim()
              .toLowerCase()
          );

      return (
        coincideBusqueda &&
        coincideCurso &&
        coincideCatedratico &&
        coincideNombreCurso &&
        coincideNombreCatedratico
      );
    })
    .sort(
      (a, b) =>
        new Date(b.fecha) - new Date(a.fecha)
    );

  const limpiarFiltros = () => {
    setBusqueda('');
    setCursoSeleccionado('');
    setCatedraticoSeleccionado('');
    setNombreCurso('');
    setNombreCatedratico('');
  };

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

        <section className="filtros-panel">

          <div className="busqueda-principal">

            <label htmlFor="busqueda">
              Buscar publicaciones
            </label>

            <input
              id="busqueda"
              type="text"
              placeholder="Buscar por curso, catedrático, usuario o publicación..."
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
            />

          </div>

          <div className="filtros-grid">

            <div className="filtro-grupo">

              <label htmlFor="filtroCurso">
                Filtrar por curso
              </label>

              <select
                id="filtroCurso"
                value={cursoSeleccionado}
                onChange={(event) =>
                  setCursoSeleccionado(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Todos los cursos
                </option>

                {cursos.map((curso) => (
                  <option
                    key={curso}
                    value={curso}
                  >
                    {curso}
                  </option>
                ))}
              </select>

            </div>

            <div className="filtro-grupo">

              <label htmlFor="filtroCatedratico">
                Filtrar por catedrático
              </label>

              <select
                id="filtroCatedratico"
                value={catedraticoSeleccionado}
                onChange={(event) =>
                  setCatedraticoSeleccionado(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Todos los catedráticos
                </option>

                {catedraticos.map(
                  (catedratico) => (
                    <option
                      key={catedratico}
                      value={catedratico}
                    >
                      {catedratico}
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="filtro-grupo">

              <label htmlFor="nombreCurso">
                Nombre del curso
              </label>

              <input
                id="nombreCurso"
                type="text"
                placeholder="Ej. Bases de Datos"
                value={nombreCurso}
                onChange={(event) =>
                  setNombreCurso(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="filtro-grupo">

              <label htmlFor="nombreCatedratico">
                Nombre del catedrático
              </label>

              <input
                id="nombreCatedratico"
                type="text"
                placeholder="Ej. María González"
                value={nombreCatedratico}
                onChange={(event) =>
                  setNombreCatedratico(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="filtros-footer">

            <span>
              {publicacionesFiltradas.length}
              {' '}
              publicación(es) encontrada(s)
            </span>

            <button
              type="button"
              className="limpiar-button"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>

          </div>

        </section>

        <section className="feed">

          {publicacionesFiltradas.length > 0 ? (

            publicacionesFiltradas.map(
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
            )

          ) : (

            <div className="sin-resultados">

              <h3>
                No se encontraron publicaciones
              </h3>

              <p>
                Prueba cambiando o eliminando
                alguno de los filtros.
              </p>

              <button
                type="button"
                className="limpiar-button"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Inicio;
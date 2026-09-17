import {
  useEffect,
  useState
} from 'react';

import {
  Navigate,
  useNavigate
} from 'react-router-dom';

import './Inicio.css';

import {
  obtenerCatedraticos,
  obtenerCursos,
  obtenerPublicaciones
} from '../services/publicacionesService';

function Inicio() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem('token');

  const usuarioGuardado =
    localStorage.getItem('usuario');

  // -----------------------------
  // Estados de filtros
  // -----------------------------

  const [busqueda, setBusqueda] =
    useState('');

  const [
    cursoSeleccionado,
    setCursoSeleccionado
  ] = useState('');

  const [
    catedraticoSeleccionado,
    setCatedraticoSeleccionado
  ] = useState('');

  const [
    nombreCurso,
    setNombreCurso
  ] = useState('');

  const [
    nombreCatedratico,
    setNombreCatedratico
  ] = useState('');

  // -----------------------------
  // Datos obtenidos del backend
  // -----------------------------

  const [
    publicaciones,
    setPublicaciones
  ] = useState([]);

  const [
    cursos,
    setCursos
  ] = useState([]);

  const [
    catedraticos,
    setCatedraticos
  ] = useState([]);

  const [
    cargando,
    setCargando
  ] = useState(true);

  const [
    errorCarga,
    setErrorCarga
  ] = useState('');

  // -----------------------------
  // Cargar información del backend
  // -----------------------------

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setErrorCarga('');

        const [
          respuestaPublicaciones,
          respuestaCursos,
          respuestaCatedraticos
        ] = await Promise.all([
          obtenerPublicaciones(),
          obtenerCursos(),
          obtenerCatedraticos()
        ]);

        setPublicaciones(
          respuestaPublicaciones.publicaciones || []
        );

        setCursos(
          respuestaCursos.cursos || []
        );

        setCatedraticos(
          respuestaCatedraticos.catedraticos || []
        );

      } catch (error) {
        setErrorCarga(error.message);

      } finally {
        setCargando(false);
      }
    };

    if (token) {
      cargarDatos();
    }
  }, [token]);

  // -----------------------------
  // Obtener usuario autenticado
  // -----------------------------

  let usuario = null;

  if (usuarioGuardado) {
    try {
      usuario =
        JSON.parse(usuarioGuardado);

    } catch {
      usuario = null;
    }
  }

  // -----------------------------
  // Proteger la pantalla
  // -----------------------------

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // -----------------------------
  // Aplicar filtros
  // -----------------------------

  const publicacionesFiltradas =
    publicaciones
      .filter((publicacion) => {

        const textoBusqueda =
          busqueda
            .trim()
            .toLowerCase();

        const nombreAutor =
          `${publicacion.autor?.nombres || ''} ${
            publicacion.autor?.apellidos || ''
          }`
            .trim()
            .toLowerCase();

        const nombreCursoReal =
          publicacion.curso?.nombre || '';

        const nombreCatedraticoReal =
          publicacion.catedratico
            ? `${publicacion.catedratico.nombres || ''} ${
                publicacion.catedratico.apellidos || ''
              }`.trim()
            : '';

        const mensaje =
          publicacion.mensaje || '';

        const coincideBusqueda =
          !textoBusqueda ||
          mensaje
            .toLowerCase()
            .includes(textoBusqueda) ||
          nombreCursoReal
            .toLowerCase()
            .includes(textoBusqueda) ||
          nombreCatedraticoReal
            .toLowerCase()
            .includes(textoBusqueda) ||
          nombreAutor
            .includes(textoBusqueda);

        const coincideCurso =
          !cursoSeleccionado ||
          String(
            publicacion.curso?.id_curso
          ) === cursoSeleccionado;

        const coincideCatedratico =
          !catedraticoSeleccionado ||
          String(
            publicacion
              .catedratico
              ?.id_catedratico
          ) === catedraticoSeleccionado;

        const coincideNombreCurso =
          !nombreCurso.trim() ||
          nombreCursoReal
            .toLowerCase()
            .includes(
              nombreCurso
                .trim()
                .toLowerCase()
            );

        const coincideNombreCatedratico =
          !nombreCatedratico.trim() ||
          nombreCatedraticoReal
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
          new Date(
            b.fecha_publicacion
          ) -
          new Date(
            a.fecha_publicacion
          )
      );

  // -----------------------------
  // Limpiar filtros
  // -----------------------------

  const limpiarFiltros = () => {
    setBusqueda('');
    setCursoSeleccionado('');
    setCatedraticoSeleccionado('');
    setNombreCurso('');
    setNombreCatedratico('');
  };

  // -----------------------------
  // Cerrar sesión
  // -----------------------------

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/login');
  };

  // -----------------------------
  // Formatear fecha
  // -----------------------------

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return 'Fecha no disponible';
    }

    return new Date(
      fecha
    ).toLocaleString(
      'es-GT',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    );
  };

  // -----------------------------
  // Interfaz
  // -----------------------------

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
              Consulta opiniones sobre cursos
              y catedráticos de la Facultad
              de Ingeniería.
            </p>

          </div>

        </section>

        {/* FILTROS */}

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
                setBusqueda(
                  event.target.value
                )
              }
            />

          </div>

          <div className="filtros-grid">

            {/* FILTRO CURSO */}

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
                    key={curso.id_curso}
                    value={String(
                      curso.id_curso
                    )}
                  >
                    {curso.codigo}
                    {' - '}
                    {curso.nombre}
                  </option>
                ))}

              </select>

            </div>

            {/* FILTRO CATEDRATICO */}

            <div className="filtro-grupo">

              <label htmlFor="filtroCatedratico">
                Filtrar por catedrático
              </label>

              <select
                id="filtroCatedratico"
                value={
                  catedraticoSeleccionado
                }
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
                      key={
                        catedratico
                          .id_catedratico
                      }
                      value={String(
                        catedratico
                          .id_catedratico
                      )}
                    >
                      {catedratico.nombres}
                      {' '}
                      {catedratico.apellidos}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* NOMBRE CURSO */}

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

            {/* NOMBRE CATEDRATICO */}

            <div className="filtro-grupo">

              <label htmlFor="nombreCatedratico">
                Nombre del catedrático
              </label>

              <input
                id="nombreCatedratico"
                type="text"
                placeholder="Ej. Juan Pérez"
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
              {
                publicacionesFiltradas.length
              }
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

        {/* CARGANDO */}

        {cargando && (
          <div className="estado-carga">
            Cargando publicaciones...
          </div>
        )}

        {/* ERROR */}

        {errorCarga && (
          <div className="estado-error">
            {errorCarga}
          </div>
        )}

        {/* FEED */}

        {!cargando && !errorCarga && (
          <section className="feed">

            {
              publicacionesFiltradas.length > 0
                ? (

                  publicacionesFiltradas.map(
                    (publicacion) => (

                      <article
                        className="publicacion-card"
                        key={
                          publicacion
                            .id_publicacion
                        }
                      >

                        <div className="publicacion-header">

                          <div className="avatar">

                            {
                              publicacion
                                .autor
                                ?.nombres
                                ?.charAt(0)
                                .toUpperCase()
                              || 'U'
                            }

                          </div>

                          <div>

                            <h3>
                              {
                                publicacion.autor
                                  ? `${publicacion.autor.nombres} ${publicacion.autor.apellidos}`
                                  : 'Usuario'
                              }
                            </h3>

                            <span className="fecha-publicacion">

                              {
                                formatearFecha(
                                  publicacion
                                    .fecha_publicacion
                                )
                              }

                            </span>

                          </div>

                        </div>

                        {/* ETIQUETAS */}

                        <div className="publicacion-tags">

                          {
                            publicacion.curso && (
                              <span className="tag">

                                {
                                  publicacion
                                    .curso
                                    .codigo
                                }

                                {' - '}

                                {
                                  publicacion
                                    .curso
                                    .nombre
                                }

                              </span>
                            )
                          }

                          {
                            publicacion
                              .catedratico && (

                              <span className="tag tag-secondary">

                                {
                                  publicacion
                                    .catedratico
                                    .nombres
                                }

                                {' '}

                                {
                                  publicacion
                                    .catedratico
                                    .apellidos
                                }

                              </span>

                            )
                          }

                        </div>

                        {/* MENSAJE */}

                        <p className="publicacion-mensaje">

                          {
                            publicacion.mensaje
                          }

                        </p>

                        {/* COMENTARIOS */}

                        <div className="publicacion-footer">

                          <span>
                            💬
                            {' '}
                            {
                              publicacion
                                .total_comentarios
                              || 0
                            }
                            {' '}
                            comentario(s)
                          </span>

                        </div>

                      </article>

                    )
                  )

                )
                : (

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

                )
            }

          </section>
        )}

      </main>

    </div>
  );
}

export default Inicio;
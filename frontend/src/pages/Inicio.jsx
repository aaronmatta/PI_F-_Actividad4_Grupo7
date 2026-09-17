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

  const [
    busqueda,
    setBusqueda
  ] = useState('');

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
  // Cargar cursos y catedraticos
  // -----------------------------

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setErrorCarga('');

        const [
          respuestaCursos,
          respuestaCatedraticos
        ] = await Promise.all([
          obtenerCursos(),
          obtenerCatedraticos()
        ]);

        setCursos(
          respuestaCursos.cursos || []
        );

        setCatedraticos(
          respuestaCatedraticos.catedraticos || []
        );

      } catch (error) {
        setErrorCarga(
          error.message
        );
      }
    };

    if (token) {
      cargarCatalogos();
    }
  }, [token]);

  // -----------------------------
  // Cargar publicaciones
  // -----------------------------

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        setCargando(true);
        setErrorCarga('');

        const respuesta =
          await obtenerPublicaciones({
            id_curso:
              cursoSeleccionado,

            id_catedratico:
              catedraticoSeleccionado,

            search:
              busqueda
          });

        setPublicaciones(
          respuesta.publicaciones || []
        );

      } catch (error) {
        setErrorCarga(
          error.message
        );

      } finally {
        setCargando(false);
      }
    };

    if (!token) {
      return undefined;
    }

    const temporizador =
      setTimeout(
        cargarPublicaciones,
        300
      );

    return () => {
      clearTimeout(
        temporizador
      );
    };

  }, [
    token,
    busqueda,
    cursoSeleccionado,
    catedraticoSeleccionado
  ]);

  // -----------------------------
  // Obtener usuario guardado
  // -----------------------------

  let usuario = null;

  if (usuarioGuardado) {
    try {
      usuario =
        JSON.parse(
          usuarioGuardado
        );

    } catch {
      usuario = null;
    }
  }

  // -----------------------------
  // Proteger pantalla
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
  // Filtros locales
  // -----------------------------

  const publicacionesFiltradas =
    publicaciones
      .filter((publicacion) => {

        const nombreCursoReal =
          publicacion
            .curso
            ?.nombre || '';

        const nombreCatedraticoReal =
          publicacion.catedratico
            ? `${publicacion.catedratico.nombres || ''} ${
                publicacion.catedratico.apellidos || ''
              }`.trim()
            : '';

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
  // Cerrar sesion
  // -----------------------------

  const cerrarSesion = () => {
    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'usuario'
    );

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
              Foro Ingenieria
            </h1>

            <p>
              Facultad de Ingenieria - USAC
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
            Cerrar sesion
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
              catedraticos de la Facultad de Ingenieria.
            </p>

          </div>

        </section>

        {/* Panel de filtros */}

        <section className="filtros-panel">

          <div className="busqueda-principal">

            <label htmlFor="busqueda">
              Buscar publicaciones
            </label>

            <input
              id="busqueda"
              type="text"
              placeholder="Buscar por curso, catedratico, usuario o publicacion..."
              value={busqueda}
              onChange={(event) =>
                setBusqueda(
                  event.target.value
                )
              }
            />

          </div>

          <div className="filtros-grid">

            {/* Filtro por curso */}

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
                    key={
                      curso.id_curso
                    }
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

            {/* Filtro por catedratico */}

            <div className="filtro-grupo">

              <label htmlFor="filtroCatedratico">
                Filtrar por catedratico
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
                  Todos los catedraticos
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

            {/* Nombre del curso */}

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

            {/* Nombre del catedratico */}

            <div className="filtro-grupo">

              <label htmlFor="nombreCatedratico">
                Nombre del catedratico
              </label>

              <input
                id="nombreCatedratico"
                type="text"
                placeholder="Ej. Juan Perez"
                value={
                  nombreCatedratico
                }
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
              publicacion(es) encontrada(s)
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

        {/* Estado de carga */}

        {cargando && (
          <div className="estado-carga">
            Cargando publicaciones...
          </div>
        )}

        {/* Error */}

        {errorCarga && (
          <div className="estado-error">
            {errorCarga}
          </div>
        )}

        {/* Feed */}

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

                        {/* Etiquetas */}

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

                        {/* Mensaje */}

                        <p className="publicacion-mensaje">
                          {publicacion.mensaje}
                        </p>

                        {/* Comentarios */}

                        <div className="publicacion-footer">

                          <span>
                            {'Comentarios: '}
                            {
                              publicacion
                                .total_comentarios
                              || 0
                            }
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
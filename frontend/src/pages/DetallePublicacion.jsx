import {
  useEffect,
  useState
} from 'react';

import './Publicaciones.css';

import {
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom';

import Comentarios
  from '../components/Comentarios';

import {
  obtenerPublicacionPorId
} from '../services/publicacionesService';

function DetallePublicacion() {
  const { id } = useParams();

  const navigate = useNavigate();

  const token =
    localStorage.getItem('token');

  const [
    publicacion,
    setPublicacion
  ] = useState(null);

  const [
    cargando,
    setCargando
  ] = useState(true);

  const [
    error,
    setError
  ] = useState('');

  useEffect(() => {
    const cargarPublicacion =
      async () => {
        try {
          setCargando(true);
          setError('');

          const respuesta =
            await obtenerPublicacionPorId(
              id
            );

          setPublicacion(
            respuesta.publicacion
          );

        } catch (errorCarga) {
          setError(
            errorCarga.message
          );

        } finally {
          setCargando(false);
        }
      };

    if (token && id) {
      cargarPublicacion();
    }
  }, [token, id]);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return '';
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

  return (
    <div className="detalle-publicacion-page">

      <main className="detalle-publicacion-container">

        <button
          type="button"
          onClick={() =>
            navigate('/inicio')
          }
        >
          ← Volver al inicio
        </button>

        {cargando && (
          <div className="estado-carga">
            Cargando publicación...
          </div>
        )}

        {error && (
          <div className="estado-error">
            {error}
          </div>
        )}

        {!cargando &&
          !error &&
          publicacion && (

            <>
              <article className="detalle-publicacion-card">

                <div className="publicacion-header">

                  <div>

                    <h2>
                      {publicacion.autor
                        ? `${publicacion.autor.nombres} ${publicacion.autor.apellidos}`
                        : 'Usuario'}
                    </h2>

                    <span>
                      {formatearFecha(
                        publicacion
                          .fecha_publicacion
                      )}
                    </span>

                  </div>

                </div>

                <div className="publicacion-tags">

                  {publicacion.curso && (
                    <span className="tag">
                      {publicacion.curso.codigo}
                      {' - '}
                      {publicacion.curso.nombre}
                    </span>
                  )}

                  {publicacion.catedratico && (
                    <span className="tag tag-secondary">
                      {publicacion
                        .catedratico
                        .nombres}
                      {' '}
                      {publicacion
                        .catedratico
                        .apellidos}
                    </span>
                  )}

                </div>

                <p className="publicacion-mensaje">
                  {publicacion.mensaje}
                </p>

              </article>

              <Comentarios
                idPublicacion={id}
              />
            </>
          )}

      </main>

    </div>
  );
}

export default DetallePublicacion;
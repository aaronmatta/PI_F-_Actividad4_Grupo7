import {
  useEffect,
  useState
} from 'react';

import './Publicaciones.css';

import {
  Navigate,
  useNavigate
} from 'react-router-dom';

import {
  obtenerCursos,
  obtenerCatedraticos,
  crearPublicacion
} from '../services/publicacionesService';


function CrearPublicacion() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem('token');

  const [tipo, setTipo] =
    useState('');

  const [seleccion, setSeleccion] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');

  const [cursos, setCursos] =
    useState([]);

  const [
    catedraticos,
    setCatedraticos
  ] = useState([]);

  const [resultado, setResultado] =
    useState('');

  const [error, setError] =
    useState('');

  const [cargando, setCargando] =
    useState(false);

  const [
    cargandoCatalogos,
    setCargandoCatalogos
  ] = useState(true);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setCargandoCatalogos(true);
        setError('');

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
          respuestaCatedraticos
            .catedraticos || []
        );

      } catch (errorCarga) {
        setError(errorCarga.message);

      } finally {
        setCargandoCatalogos(false);
      }
    };

    if (token) {
      cargarCatalogos();
    }
  }, [token]);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setResultado('');
    setError('');

    if (
      !tipo ||
      !seleccion ||
      !mensaje.trim()
    ) {
      setError(
        'Debes completar todos los campos.'
      );
      return;
    }

    const nuevaPublicacion = {
      tipo,
      id_curso:
        tipo === 'curso'
          ? Number(seleccion)
          : null,

      id_catedratico:
        tipo === 'catedratico'
          ? Number(seleccion)
          : null,

      mensaje: mensaje.trim()
    };

    try {
      setCargando(true);

      const respuesta =
        await crearPublicacion(
          nuevaPublicacion
        );

      setResultado(
        respuesta.mensaje ||
        'Publicación creada correctamente.'
      );

      setTipo('');
      setSeleccion('');
      setMensaje('');

    } catch (errorPublicacion) {
      setError(
        errorPublicacion.message
      );

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="crear-publicacion-page">

      <main className="crear-publicacion-container">

        <button
          type="button"
          onClick={() =>
            navigate('/inicio')
          }
        >
          ← Volver al inicio
        </button>

        <h1>
          Crear publicación
        </h1>

        <p>
          Comparte tu opinión o experiencia
          sobre un curso o catedrático.
        </p>

        {cargandoCatalogos && (
          <p>
            Cargando cursos y
            catedráticos...
          </p>
        )}

        {error && (
          <div className="estado-error">
            {error}
          </div>
        )}

        {resultado && (
          <div className="estado-exito">
            {resultado}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div>
            <label htmlFor="tipo">
              ¿Sobre qué deseas publicar?
            </label>

            <select
              id="tipo"
              value={tipo}
              onChange={(event) => {
                setTipo(
                  event.target.value
                );

                setSeleccion('');
              }}
            >
              <option value="">
                Selecciona una opción
              </option>

              <option value="curso">
                Curso
              </option>

              <option value="catedratico">
                Catedrático
              </option>
            </select>
          </div>

          {tipo === 'curso' && (
            <div>
              <label htmlFor="curso">
                Selecciona el curso
              </label>

              <select
                id="curso"
                value={seleccion}
                onChange={(event) =>
                  setSeleccion(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Selecciona un curso
                </option>

                {cursos.map((curso) => (
                  <option
                    key={curso.id_curso}
                    value={curso.id_curso}
                  >
                    {curso.codigo}
                    {' - '}
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tipo === 'catedratico' && (
            <div>
              <label htmlFor="catedratico">
                Selecciona el catedrático
              </label>

              <select
                id="catedratico"
                value={seleccion}
                onChange={(event) =>
                  setSeleccion(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Selecciona un catedrático
                </option>

                {catedraticos.map(
                  (catedratico) => (
                    <option
                      key={
                        catedratico
                          .id_catedratico
                      }
                      value={
                        catedratico
                          .id_catedratico
                      }
                    >
                      {catedratico.nombres}
                      {' '}
                      {catedratico.apellidos}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="mensaje">
              Mensaje
            </label>

            <textarea
              id="mensaje"
              value={mensaje}
              onChange={(event) =>
                setMensaje(
                  event.target.value
                )
              }
              placeholder="Escribe tu publicación..."
              rows="6"
            />
          </div>

          <button
            type="submit"
            disabled={
              cargando ||
              cargandoCatalogos
            }
          >
            {cargando
              ? 'Publicando...'
              : 'Publicar'}
          </button>

        </form>

      </main>

    </div>
  );
}

export default CrearPublicacion;
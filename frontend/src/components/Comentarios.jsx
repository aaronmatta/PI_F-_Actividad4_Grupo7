import {
  useEffect,
  useState
} from 'react';

import {
  crearComentario,
  obtenerComentarios
} from '../services/publicacionesService';

function Comentarios({
  idPublicacion
}) {
  const [
    comentarios,
    setComentarios
  ] = useState([]);

  const [
    nuevoComentario,
    setNuevoComentario
  ] = useState('');

  const [
    cargando,
    setCargando
  ] = useState(true);

  const [
    enviando,
    setEnviando
  ] = useState(false);

  const [
    error,
    setError
  ] = useState('');

  const [
    resultado,
    setResultado
  ] = useState('');

  useEffect(() => {
    const cargarComentarios =
      async () => {
        try {
          setCargando(true);
          setError('');

          const respuesta =
            await obtenerComentarios(
              idPublicacion
            );

          setComentarios(
            respuesta.comentarios || []
          );

        } catch (errorCarga) {
          setError(
            errorCarga.message
          );

        } finally {
          setCargando(false);
        }
      };

    if (idPublicacion) {
      cargarComentarios();
    }
  }, [idPublicacion]);

  const agregarComentario =
    async (event) => {
      event.preventDefault();

      setError('');
      setResultado('');

      if (!nuevoComentario.trim()) {
        setError(
          'Debes escribir un comentario.'
        );
        return;
      }

      try {
        setEnviando(true);

        const respuesta =
          await crearComentario(
            idPublicacion,
            nuevoComentario.trim()
          );

        setComentarios(
          (comentariosActuales) => [
            ...comentariosActuales,
            respuesta.comentario
          ]
        );

        setNuevoComentario('');

        setResultado(
          respuesta.mensaje ||
          'Comentario agregado correctamente.'
        );

      } catch (errorComentario) {
        setError(
          errorComentario.message
        );

      } finally {
        setEnviando(false);
      }
    };

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
    <section className="seccion-comentarios">

      <h2>
        Comentarios
      </h2>

      {cargando && (
        <p>
          Cargando comentarios...
        </p>
      )}

      {error && (
        <div className="estado-error">
          {error}
        </div>
      )}

      {!cargando &&
        comentarios.length === 0 && (
          <p>
            No hay comentarios todavía.
            Sé el primero en comentar.
          </p>
        )}

      {!cargando &&
        comentarios.length > 0 && (

          <div className="lista-comentarios">

            {comentarios.map(
              (comentario) => (

                <article
                  className="comentario"
                  key={
                    comentario.id_comentario
                  }
                >

                  <div className="comentario-encabezado">

                    <strong>
                      {comentario.autor
                        ? `${comentario.autor.nombres} ${comentario.autor.apellidos}`
                        : 'Usuario'}
                    </strong>

                    <span>
                      {formatearFecha(
                        comentario
                          .fecha_comentario
                      )}
                    </span>

                  </div>

                  <p>
                    {comentario.comentario}
                  </p>

                </article>
              )
            )}

          </div>
        )}

      <form
        className="form-comentario"
        onSubmit={agregarComentario}
      >

        <label htmlFor="comentario">
          Agregar comentario
        </label>

        <textarea
          id="comentario"
          value={nuevoComentario}
          onChange={(event) =>
            setNuevoComentario(
              event.target.value
            )
          }
          placeholder="Escribe un comentario..."
          rows="4"
        />

        <button
          type="submit"
          disabled={enviando}
        >
          {enviando
            ? 'Comentando...'
            : 'Comentar'}
        </button>

        {resultado && (
          <div className="estado-exito">
            {resultado}
          </div>
        )}

      </form>

    </section>
  );
}

export default Comentarios;
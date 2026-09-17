const API_URL =
  'http://localhost:3000/api';

const obtenerToken = () => {
  return localStorage.getItem('token');
};

const procesarRespuesta = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje ||
      'Ocurrió un error al comunicarse con el servidor'
    );
  }

  return data;
};

const crearHeaders = () => {
  const token = obtenerToken();

  return {
    Authorization: `Bearer ${token}`
  };
};

export const obtenerPublicaciones =
  async (filtros = {}) => {

    const parametros =
      new URLSearchParams();

    parametros.set(
      'orden',
      'desc'
    );

    if (filtros.id_curso) {
      parametros.set(
        'id_curso',
        filtros.id_curso
      );
    }

    if (filtros.id_catedratico) {
      parametros.set(
        'id_catedratico',
        filtros.id_catedratico
      );
    }

    if (filtros.search?.trim()) {
      parametros.set(
        'search',
        filtros.search.trim()
      );
    }

    const response = await fetch(
      `${API_URL}/posts?${parametros.toString()}`,
      {
        method: 'GET',
        headers: crearHeaders()
      }
    );

    return procesarRespuesta(response);
  };

export const obtenerCursos =
  async () => {

    const response = await fetch(
      `${API_URL}/courses`,
      {
        method: 'GET',
        headers: crearHeaders()
      }
    );

    return procesarRespuesta(response);
  };

export const obtenerCatedraticos =
  async () => {

    const response = await fetch(
      `${API_URL}/teachers`,
      {
        method: 'GET',
        headers: crearHeaders()
      }
    );

    return procesarRespuesta(response);
  };


export const crearPublicacion =
  async (publicacion) => {

    const response = await fetch(
      `${API_URL}/posts`,
      {
        method: 'POST',

        headers: {
          ...crearHeaders(),
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify(
          publicacion
        )
      }
    );

    return procesarRespuesta(response);
  };


  export const obtenerPublicacionPorId =
  async (idPublicacion) => {

    const response = await fetch(
      `${API_URL}/posts/${idPublicacion}`,
      {
        method: 'GET',
        headers: crearHeaders()
      }
    );

    return procesarRespuesta(response);
  };


export const obtenerComentarios =
  async (idPublicacion) => {

    const response = await fetch(
      `${API_URL}/posts/${idPublicacion}/comments`,
      {
        method: 'GET',
        headers: crearHeaders()
      }
    );

    return procesarRespuesta(response);
  };


  
export const crearComentario =
  async (
    idPublicacion,
    comentario
  ) => {

    const response = await fetch(
      `${API_URL}/posts/${idPublicacion}/comments`,
      {
        method: 'POST',

        headers: {
          ...crearHeaders(),
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          comentario
        })
      }
    );

    return procesarRespuesta(response);
  };
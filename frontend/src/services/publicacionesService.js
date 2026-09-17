const API_URL =
  'http://localhost:3000/api';

const obtenerToken = () => {
  return localStorage.getItem('token');
};

const procesarRespuesta = async (
  response
) => {
  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje ||
      'Ocurrió un error al comunicarse con el servidor'
    );
  }

  return data;
};

const crearHeaders = () => {
  const token =
    obtenerToken();

  return {
    Authorization:
      `Bearer ${token}`
  };
};

export const obtenerPublicaciones =
  async () => {

    const response =
      await fetch(
        `${API_URL}/posts?orden=desc`,
        {
          method: 'GET',
          headers: crearHeaders()
        }
      );

    return procesarRespuesta(
      response
    );
  };

export const obtenerCursos =
  async () => {

    const response =
      await fetch(
        `${API_URL}/courses`,
        {
          method: 'GET',
          headers: crearHeaders()
        }
      );

    return procesarRespuesta(
      response
    );
  };

export const obtenerCatedraticos =
  async () => {

    const response =
      await fetch(
        `${API_URL}/teachers`,
        {
          method: 'GET',
          headers: crearHeaders()
        }
      );

    return procesarRespuesta(
      response
    );
  };
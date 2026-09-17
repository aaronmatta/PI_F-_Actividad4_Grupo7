const API_URL = 'http://localhost:3000/api/auth';

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

export const registrarUsuario = async (datosUsuario) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(datosUsuario),
  });

  return procesarRespuesta(response);
};

export const iniciarSesion = async (credenciales) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(credenciales),
  });

  return procesarRespuesta(response);
};

export const recuperarContrasena = async (datosRecuperacion) => {
  const response = await fetch(`${API_URL}/recover-password`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(datosRecuperacion),
  });

  return procesarRespuesta(response);
};
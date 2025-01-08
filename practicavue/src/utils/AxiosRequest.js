import axios from 'axios';

const SERVER_URL = 'http://localhost:4000/api';

/**
 * Función asíncrona para realizar peticiones al servidor utilizando Axios y enviando datos como `form-data`.
 * @param {string} endpoint - El endpoint al que se realizará la petición.
 * @param {string} method - Método HTTP en formato CRUD (C, R, U, D).
 * @param {Object} form - Datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
const AxiosRequest = async (endpoint, method, form = {}) => {
  let httpMethod;

  // Mapear el método HTTP basado en CRUD
  switch (method.toUpperCase()) {
    case 'C':
      httpMethod = 'POST';
      break;
    case 'R':
      httpMethod = 'GET';
      break;
    case 'U':
      httpMethod = 'PUT';
      break;
    case 'D':
      httpMethod = 'DELETE';
      break;
    case 'P':
      httpMethod = 'PATCH';
      break;
    default:
      console.error('Método no válido');
      return;
  }

  // Configurar `form-data` para el cuerpo de la petición
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Configurar opciones para Axios
  const OPTIONS = {
    method: httpMethod,
    url: SERVER_URL + endpoint,
    headers: {},
    data: null,
  };

  // Agregar datos al cuerpo solo si el método lo permite
  if (httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH' || httpMethod === 'DELETE') {
    OPTIONS.data = formData;
  }

  try {
    // Realizar la petición
    const RESPONSE = await axios(OPTIONS);

    // Imprimir información de la respuesta
    console.log('RESPONSE:', {
      URL: OPTIONS.url,
      Status: RESPONSE.status,
      Data: RESPONSE.data,
    });

    // Devolver los datos
    return RESPONSE.data;
  } catch (error) {
    console.error('Error en la petición:', error);

    // Si hay un problema en la respuesta del servidor, manejarlo aquí
    if (error.response) {
      console.log('Detalles del error en el servidor:', error.response.data);
      throw new Error(
        `Error retornado desde el servidor: ${
          error.response.data.error || 'Error desconocido'
        }`
      );
    }

    throw error;
  }
};

export default AxiosRequest;

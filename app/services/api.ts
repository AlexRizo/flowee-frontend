import { clientEnv } from '~/config/env';

const API_URL = clientEnv.API_URL;

const createRequest = async (method: string, endpoint: string, body = {}, headers = {}) => {
  if (!API_URL) throw new Error('La URL de la API no está definida');

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      ...((method !== 'GET' && method !== 'DELETE') && {
        body: JSON.stringify(body)
      }),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },  
      credentials: 'include',
    });

    return response.json();
  } catch (error) {
    console.error(new Error('Ha ocurrido un error al intentar hacer fetching a la API:', { cause: error }));
    return {
      message: 'Error al procesar la solicitud. Intenta nuevamente. Si el problema persiste, contacta al administrador.',
      error: 'Internal server error',
      statusCode: 500,
    };
  }
};

export const api = {
  get: async (endpoint: string, headers = {}) => {
    return createRequest('GET', endpoint, undefined, headers);
  },

  post: async (endpoint: string, body = {}, headers = {}) => {
    return createRequest('POST', endpoint, body, headers);
  },

  patch: async (endpoint: string, body = {}, headers = {}) => {
    return createRequest('PATCH', endpoint, body, headers);
  },

  delete: async (endpoint: string, headers = {}) => {
    return createRequest('DELETE', endpoint, undefined, headers);
  }
};

export const getErrorMessage = (message?: string | string[]): string => {
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message || '';
};
import { clientEnv } from '~/config/env';

const API_URL = clientEnv.API_URL;

interface CreateRequestOptions {
  method: string;
  endpoint: string;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

const createRequest = async ({ method, endpoint, body, headers = {}, isFormData }: CreateRequestOptions) => {
  if (!API_URL) throw new Error('La URL de la API no está definida');

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      ...((method !== 'GET' && method !== 'DELETE') && {
        body: isFormData ? body as FormData : JSON.stringify(body),
      }),
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...headers,
      },  
      credentials: 'include',
    });
    console.log({response})

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
    return createRequest({ method: 'GET', endpoint, headers });
  },

  post: async (endpoint: string, body: unknown, headers = {}, isFormData = false) => {
    return createRequest({ method: 'POST', endpoint, body, headers, isFormData });
  },

  patch: async (endpoint: string, body: unknown, headers = {}, isFormData = false) => {
    return createRequest({ method: 'PATCH', endpoint, body, headers, isFormData });
  },

  delete: async (endpoint: string, headers = {}) => {
    return createRequest({ method: 'DELETE', endpoint, headers });
  }
};

export const getErrorMessage = (message?: string | string[]): string => {
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message || '';
};
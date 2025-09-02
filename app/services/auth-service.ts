import { redirect } from 'react-router';
import { api, getErrorMessage } from '../services/api';
import type { LoginResponse } from './interfaces/auth-service.interface';

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return await api.post('auth/login', { email, password })
  .then((res: LoginResponse) => {
    console.log({res})
    
    if (res.error) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      };
    }
    return { user: res.user };
  });
};

export const checkAuth = async (cookie?: string) => {
  return await api.get('auth/check-auth', { cookie })
  .then((res: LoginResponse) => {
    if (res.error || !res.user) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      };
    }

    return { user: res.user };
  });
};

export const logout = async () => {
  return await api.post('auth/logout', {
    withCredentials: true,
  })
  .then((res: LoginResponse) => {
    if (res.error) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      };
    }
    
    return redirect('/auth');
  });
};
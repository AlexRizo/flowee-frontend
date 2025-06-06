import { api } from "./api";
import type { LoginResponse } from "./interfaces/auth-service.interface";

const getErrorMessage = (message?: string | string[]): string => {
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  return message || '';
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return await api({
      method: 'POST',
      endpoint: 'auth/login',
      body: { email, password },
  }).then((res: LoginResponse) => {
    if (res.error) {
      return {
        message: getErrorMessage(res.message),
        error: res.error,
        statusCode: res.statusCode,
      }
    }
    return { user: res.user };
  });
}
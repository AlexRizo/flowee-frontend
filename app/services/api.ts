import type { ApiProps } from "./interfaces/api.interface";

const API_URL = process.env.API_URL || undefined;

export const api = async ({ method = 'GET', endpoint = '', body = {}, headers = {} }: ApiProps) => {
  if (!API_URL) throw new Error("API_URL is not defined");
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  });

  return response.json();
};
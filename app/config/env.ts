export const clientEnv = {
  API_URL: import.meta.env.VITE_API_URL || process.env.VITE_API_URL,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || process.env.VITE_SOCKET_URL,
}
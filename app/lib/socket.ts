import { io, Socket } from "socket.io-client";
import { clientEnv } from "~/config/env";

let socket: Socket | null = null;

const socketUrl = clientEnv.SOCKET_URL;

console.log({
  vite: import.meta.env.VITE_SOCKET_URL,
  process: process.env.VITE_SOCKET_URL,
})

if (!socketUrl) throw new Error("Socket URL is not defined:" + socketUrl);

export const getSocket = () => {
  if (!socket) {
    socket = io(socketUrl, {
      withCredentials: true,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
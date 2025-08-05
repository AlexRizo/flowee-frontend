import { createContext, useContext, useEffect, useState, type FC } from "react";
import type { Socket } from "socket.io-client";
import { disconnectSocket, getSocket } from "~/lib/socket";

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [ socket, setSocket ] = useState<Socket | null>(null);
  
  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    console.log("connected socket", s);

    return () => {
      disconnectSocket();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) throw new Error("useSocket debe estar dentro de SocketProvider");

  return socket;
}
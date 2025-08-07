import { createContext, useContext, useEffect, useState, type FC } from "react";
import type { Socket } from "socket.io-client";
import { disconnectSocket, getSocket } from "~/lib/socket";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);


interface SocketProviderProps {
  children: React.ReactNode;
}


export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [ socket, setSocket ] = useState<SocketContextType>(null);
  
  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    console.log("connected socket", s);

    return () => {
      disconnectSocket();
    };
  }, []);

  return <SocketContext.Provider value={ socket }>{children}</SocketContext.Provider>
} 

export const useSocket = () => {
  const socket = useContext(SocketContext);

  // ? Es posible que al cargar la página no se haya conectado el socket
  // if (!socket) throw new Error("useSocket debe estar dentro de SocketProvider");

  return socket;
}
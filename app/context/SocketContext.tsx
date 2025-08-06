import { createContext, useContext, useEffect, useState, type FC } from "react";
import type { Socket } from "socket.io-client";
import { disconnectSocket, getSocket } from "~/lib/socket";

interface SocketMap {
  [key: string]: Socket | null;
  // boardsSocket: Socket | null;
}

const initialSocketMap: SocketMap = {
  tasksSocket: null,
  // boardsSocket: null,
};

const SocketContext = createContext<SocketMap>(initialSocketMap);

interface SocketProviderProps {
  children: React.ReactNode;
}


export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [ socket, setSocket ] = useState<SocketMap>(initialSocketMap);
  
  useEffect(() => {
    const tasksSocket = getSocket("tasks");
    // const boardsSocket = getSocket("boards");
    setSocket({ tasksSocket });
    console.log("connected socket", tasksSocket);

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
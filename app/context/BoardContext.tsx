import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { Board } from "~/services/interfaces/boards-service.interface";

interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  setBoards: (boards: Board[]) => void;
  setCurrentBoard: (id: string) => void;
  allow: boolean;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

interface BoardProviderProps {
  children: React.ReactNode;
  initialBoards?: Board[];
}

export const BoardProvider = ({children, initialBoards = []}: BoardProviderProps) => {
  const [boards, setBoardsState] = useState<Board[]>(initialBoards);
  const [currentBoard, setCurrentBoardState] = useState<Board | null>(null);
  const { pathname } = useLocation();
  const [ allow, setAllow ] = useState<boolean>(false);

  const setBoards = (boards: Board[]): void => {
    setBoardsState(boards);
    setAllow(true);
  }

  const handleReset = () => {
    setCurrentBoardState(null);
    setAllow(false);
  }

  useEffect(() => {
    if (pathname.includes("solicitudes") || pathname.includes("centro-de-asignaciones")) {
      setAllow(true);
      return;
    }
    
    handleReset();
  }, [pathname])

  const setCurrentBoard = (id: string): void => {
    const board = boards.find(b => b.id === id) ?? null;
    setCurrentBoardState(board);
  }

  return (
    <BoardContext.Provider value={{ boards, currentBoard, setBoards, setCurrentBoard, allow }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = (): BoardContextType => {
  const ctx = useContext(BoardContext);

  if (!ctx) throw new Error("useBoardContext debe ser usado dentro de BoardProvider");

  return ctx;
}
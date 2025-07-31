import { createContext, useContext, useState } from "react";
import type { Board } from "~/services/interfaces/boards-service.interface";

interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  setBoards: (boards: Board[]) => void;
  setCurrentBoard: (id: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

interface BoardProviderProps {
  children: React.ReactNode;
  initialBoards?: Board[];
}

export const BoardProvider = ({children, initialBoards = []}: BoardProviderProps) => {
  const [boards, setBoardsState] = useState<Board[]>(initialBoards);
  const [currentBoard, setCurrentBoardState] = useState<Board | null>(null);

  const setBoards = (boards: Board[]): void => {
    setBoardsState(boards);
  }

  const setCurrentBoard = (id: string): void => {
    const board = boards.find(b => b.id === id) ?? null;
    setCurrentBoardState(board);
  }

  return (
    <BoardContext.Provider value={{ boards, currentBoard, setBoards, setCurrentBoard }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = (): BoardContextType => {
  const ctx = useContext(BoardContext);

  if (!ctx) throw new Error("useBoardContext debe ser usado dentro de BoardProvider");

  return ctx;
}
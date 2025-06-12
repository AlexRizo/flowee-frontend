import { Plus } from "lucide-react"
import type { Board } from "~/services/interfaces/boards-service.interface"
import { UserBoard } from "./UserBoard"
import { AddBoardsModal } from "./AddBoardsModal"
import { Button } from "~/components/ui/button"

export const UserBoards = ({ boards = [] }: { boards: Board[] }) => {
  return (
    <div role="grid" className="grid grid-cols-3 gap-4">
      {boards.map((board) => (
        <UserBoard key={board.id} color={board.color}>
          <p>{board.name}</p>
        </UserBoard>
      ))}

      <AddBoardsModal boards={boards}>
        <UserBoard >
          <Plus size={24} className="text-gray-500" />
          <p className="text-gray-500 text-sm font-medium">Agregar tablerosssss</p>
        </UserBoard>
      </AddBoardsModal>
    </div>
  )
}

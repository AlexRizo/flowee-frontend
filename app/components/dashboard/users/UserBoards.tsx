import { Plus } from "lucide-react"
import type { Board } from "~/services/interfaces/boards-service.interface"
import { UserBoard } from "./UserBoard"
import { AddBoardsModal } from "./AddBoardsModal"

export const UserBoards = ({ boards = [], allowAddBoards = true }: { boards: Board[], allowAddBoards?: boolean }) => {

  return (
    <div role="grid" className="grid grid-cols-4 gap-4">
      {boards.map((board) => (
        <UserBoard key={board.id} color={board.color}>
          <p className="text-sm font-medium">{board.name}</p>
        </UserBoard>
      ))}

      {allowAddBoards && (
        <AddBoardsModal selectedBoards={boards}>
          <UserBoard >
            <Plus size={24} className="text-gray-500" />
            <p className="text-gray-500 text-sm font-medium">Agregar tableros</p>
          </UserBoard>
        </AddBoardsModal>
      )}
    </div>
  )
}

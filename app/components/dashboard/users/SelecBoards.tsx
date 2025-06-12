import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Board } from "~/services/interfaces/boards-service.interface";

export const SelecBoards = ({
  boards,
  selectedBoards,
  setSelectedBoards,
}: {
  boards: Board[];
  selectedBoards: Board[];
  setSelectedBoards: (boards: Board[]) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label>Tableros</Label>
        <Select
          onValueChange={(values) => {
            const selectedBoards = boards.filter((board) =>
              values.includes(board.id)
            );
            setSelectedBoards(selectedBoards);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona los tableros" />
          </SelectTrigger>
          <SelectContent>
            {boards.map((board: Board) => (
              <SelectItem key={board.id} value={board.id}>
                {board.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {selectedBoards.map((board: Board) => (
          <div
            key={board.id}
            className="flex items-center justify-center p-4 rounded-lg"
            style={{ backgroundColor: board.color }}
          >
            <p className="text-white font-medium">{board.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

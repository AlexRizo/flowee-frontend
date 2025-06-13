import { Label } from "~/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import type { Board } from "~/services/interfaces/boards-service.interface";

interface SelectedBoard {
  id: string;
  name: string;
}

export const SelecBoards = ({
  boards,
  selectedBoards,
  setSelectedBoards,
}: {
  boards: Board[];
  selectedBoards: SelectedBoard[];
  setSelectedBoards: (boards: SelectedBoard[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;

    if (selectedBoards.some((b) => b.id === boardId)) {
      setSelectedBoards(selectedBoards.filter((b) => b.id !== boardId));
    } else {
      setSelectedBoards([...selectedBoards, board]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label>Tableros</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between border-gray-200"
            >
              {selectedBoards.length === 0 
                ? "Selecciona los tableros..."
                : `${selectedBoards.length} tableros seleccionados`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-gray-200">
            <Command>
              <CommandInput placeholder="Buscar tablero..." className="h-9" />
              <CommandEmpty>No se encontraron tableros.</CommandEmpty>
              <CommandGroup>
                {boards.map((board) => (
                  <CommandItem
                    key={board.id}
                    onSelect={() => handleSelect(board.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBoards.some((b) => b.id === board.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {board.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {selectedBoards.map((board) => (
          <div
            key={board.id}
            className="flex items-center justify-center p-4 rounded-lg bg-primary text-primary-foreground shadow-sm animate-bounce-fade-in"
          >
             <p className="font-medium">{board.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useDroppable } from "@dnd-kit/core";
import { CardTooltip } from "../boards/CardTooltip";
import { ClipboardPaste, Rocket } from "lucide-react";
import { cn } from "~/lib/utils";
import type { AuthUser } from "~/services/interfaces/auth-service.interface";

interface Props {
  manager: AuthUser;
}

export const ManagerCard = ({ manager }: Props) => {

  const { setNodeRef, isOver } = useDroppable({ id: manager.id });

  return (
    <div className="w-63 h-max" ref={setNodeRef}>
      <header className="border-2 border-green-400 bg-green-950 p-2 rounded-t-md flex items-center text-white">
        <CardTooltip text={manager.name}>
          <img
            src={manager.avatar || "/images/default-user.webp"}
            alt={"Avatar"}
            className="size-5 rounded"
          />
        </CardTooltip>
        <p className="ml-2 text-sm font-semibold">@{manager.nickname} (Tú)</p>
        <ClipboardPaste size={16} className="ml-auto" />
      </header>
      <div className="flex justify-between p-2 rounded-b-md border-1 border-gray-200">
        <aside
          className={cn(
            "flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 bg-gray-100 rounded-lg w-full h-24",
            isOver && "border-violet-500 bg-violet-50"
          )}
        >
          <Rocket size={26} strokeWidth={1.25} />
          <small>Asignar</small>
        </aside>
      </div>
    </div>
  );
};

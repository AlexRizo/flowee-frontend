import { useDroppable } from "@dnd-kit/core";
import { CardTooltip } from "../boards/CardTooltip";
import { ClipboardPaste, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import type { Designer } from "~/context/AssignmentContext";
import { Status } from "~/services/interfaces/tasks-service.interface";
import { cn } from "~/lib/utils";

interface Props {
  designer: Designer;
}

export const DesignerCard = ({ designer }: Props) => {
  const [designerTasks, setDesignerTasks] = useState<Record<string, number> | null>(null);

  const handleDesignerTasks = () => {
    const counter = {
      AWAIT: 0,
      IN_PROGRESS: 0,
      REVIEW: 0,
    };

    designer.tasks.forEach((task) => {
      if (task.status === Status.AWAIT) counter.AWAIT++;
      if (task.status === Status.IN_PROGRESS) counter.IN_PROGRESS++;
      if (task.status === Status.REVIEW) counter.REVIEW++;
    });

    setDesignerTasks(counter);
  };

  useEffect(() => {
    handleDesignerTasks();
  }, []);

  const { setNodeRef, isOver } = useDroppable({ id: designer.id });

  return (
    <div className="w-63 h-max" ref={setNodeRef}>
      <header className="border-2 border-green-400 bg-gray-900 p-2 rounded-t-md flex items-center text-white">
        <CardTooltip text={designer.name}>
          <img
            src={designer.avatar || "/images/default-user.webp"}
            alt={"Avatar"}
            className="size-5 rounded"
          />
        </CardTooltip>
        <p className="ml-2 text-sm font-semibold">@{designer.nickname}</p>
        <span className="ml-1 text-xs">({designer.tasks.length})</span>
        <ClipboardPaste size={16} className="ml-auto" />
      </header>
      <div className="flex justify-between p-2 rounded-b-md border-1 border-gray-200">
        <article className="text-xs flex flex-col gap-1">
          <h2 className="font-semibold">Carga de trabajo</h2>
          <p>En espera ({designerTasks?.AWAIT})</p>
          <p>Diseñando ({designerTasks?.IN_PROGRESS})</p>
          <p>En revisión ({designerTasks?.REVIEW})</p>
        </article>
        <aside
          className={cn(
            "flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 bg-gray-100 rounded-lg h-24 w-28",
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

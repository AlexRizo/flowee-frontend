import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { Task } from "~/services/interfaces/tasks-service.interface";
import { TaskParams } from "./TaskParams";
import { TaskFilesTab } from "./TaskFilesTab";

export const TaskSidebar = ({
  task,
  setPreviewTask,
}: {
  task: Task | null;
  setPreviewTask: (task: Task | null) => void;
}) => {
  const [tab, setTab] = useState<"Detalles" | "Chat" | "Entregables">("Detalles");
  
  
  return (
    <Sheet open={!!task} onOpenChange={() => setPreviewTask(null)}>
      <SheetContent className="sm:max-w-165">
        <SheetHeader className="border-b">
          <SheetTitle>{ tab }</SheetTitle>
          <SheetDescription>
            {tab === "Detalles" && "Detalles de la solicitud"}
            {tab === "Chat" && "Chat de la solicitud"}
            {tab === "Entregables" && "Entregables de la solicitud"}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <h1 className="font-bold mb-8">{ task?.title }</h1>

          { task && <TaskParams task={task} /> }

          <article className="my-10 bg-gray-100 rounded p-5">
            <h2 className="font-medium text-sm mb-1.5">Descripción</h2>
            <p className="text-xs">{ task?.description }</p>
          </article>

          <TaskFilesTab />
        </div>
      </SheetContent>
    </Sheet>
  );
};

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { Task } from "~/services/interfaces/tasks-service.interface";
import { useMutation } from "@tanstack/react-query";
import { getTaskFiles } from "~/services/tasks-service";
import { toast } from "sonner";
import { TaskTabMenu } from "./TaskTabMenu";
import { Details } from "./views/Details";
import { Chat } from "./views/Chat";
import { Formats } from "./views/Formats";

export const TaskSidebar = ({
  task,
  setPreviewTask,
}: {
  task: Task | null;
  setPreviewTask: (task: Task | null) => void;
}) => {
  const [tab, setTab] = useState<"Detalles" | "Chat" | "Entregables">(
    "Detalles"
  );

  const {
    mutate: getTaskFilesMutation,
    data: taskFiles,
    isPending,
  } = useMutation({
    mutationFn: async (taskId: string) => {
      const { message, includeFiles, referenceFiles } = await getTaskFiles(
        taskId
      );
      if (message) {
        toast.error(message);
        return;
      }

      return { includeFiles, referenceFiles };
    },
  });

  useEffect(() => {
    if (!task?.id) return;
    getTaskFilesMutation(task.id);
  }, [task]);

  return (
    <Sheet open={!!task} onOpenChange={() => setPreviewTask(null)}>
      <SheetContent className="sm:max-w-165 gap-0">
        <SheetHeader className="border-b">
          <SheetTitle>{tab}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div role="contentinfo" className="flex size-full">
          {tab === "Detalles" && <Details task={task} taskFiles={taskFiles} />}
          {tab === "Chat" && <Chat taskId={task?.id || null} />}
          {tab === "Entregables" && <Formats />}
          <TaskTabMenu tab={tab} setTab={setTab} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { TaskTabMenu } from "./TaskTabMenu";
import { Details } from "./views/Details";
import { Chat } from "./views/Chat";
import { Deliveries } from "./views/Deliveries";
import { useTaskPreview } from "~/context/TaskPreviewContext";

interface TaskSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const TaskSidebar = ({ isOpen, setIsOpen }: TaskSidebarProps) => {
  const { previewTask, taskFiles, handleGetTaskFiles } = useTaskPreview();

  const [tab, setTab] = useState<"Detalles" | "Chat" | "Entregables">(
    "Detalles"
  );

  useEffect(() => {
    handleGetTaskFiles();
    return () => {
      setTab("Detalles");
    }
  }, [previewTask]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-165 gap-0">
        <SheetHeader className="border-b">
          <SheetTitle>{tab}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div role="contentinfo" className="flex size-full">
          {tab === "Detalles" && (
            <Details task={previewTask} taskFiles={taskFiles} />
          )}
          {tab === "Chat" && <Chat taskId={previewTask?.id || null} />}
          {tab === "Entregables" && <Deliveries />}
          <TaskTabMenu tab={tab} setTab={setTab} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

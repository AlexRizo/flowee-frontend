import { TaskParams } from "../TaskParams";
import { TaskFilesTab } from "../TaskFilesTab";
import type { Task, TaskFiles } from "~/services/interfaces/tasks-service.interface";
import type { FC } from "react";

interface Props {
  task: Task | null;
  taskFiles?: TaskFiles;
}

export const Details: FC<Props> = ({ task, taskFiles }) => {
  return (
    <div role="group" className="px-4 w-full">
      <h1 className="font-bold mb-8 mt-4">{task?.title}</h1>

      {task && <TaskParams task={task} />}

      <article className="my-10 bg-gray-100 rounded p-5">
        <h2 className="font-medium text-sm mb-1.5">Descripción</h2>
        <p className="text-xs">{task?.description}</p>
      </article>

      <TaskFilesTab
        referenceFiles={taskFiles?.referenceFiles || []}
        includeFiles={taskFiles?.includeFiles || []}
      />
    </div>
  );
};

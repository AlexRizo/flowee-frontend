import { Status, type Task } from "~/services/interfaces/boards-service.interface";
import type { Route } from "../tasks/+types/_index";
import { Column } from "~/components/dashboard/boards/Column";
import { useEffect, useState } from 'react';
import { tasks as tasksData } from "./data";

export function meta() {
  return [
    {
      title: 'Solicitudes | Flowee',
    }
  ]
}

export async function loader({}: Route.LoaderArgs) {
  interface Column {
    id: Status;
    name: string;
    color: string;
  }
  
  const columns: Column[] = [
    {
      id: Status.AWAIT,
      name: 'En espera',
      color: 'gray',
    },
    {
      id: Status.ATTENTION,
      name: 'En atención',
      color: 'blue',
    },
    {
      id: Status.IN_PROGRESS,
      name: 'En proceso',
      color: 'purple',
    },
    {
      id: Status.REVIEW,
      name: 'En revisión',
      color: 'yellow',
    },
    {
      id: Status.DONE,
      name: 'Finalizado',
      color: 'green',
    }
  ]

  return { columns };
}

const Home = ({ loaderData }: Route.ComponentProps) => {
  const { columns } = loaderData;

  const [tasks, setTasks] = useState<Record<Status, Task[]> | null>(null);

  useEffect(() => {
    const tasks = tasksData.reduce((acc, task) => {
      acc[task.status] = [...(acc[task.status] || []), task];
      return acc;
    }, {} as Record<Status, Task[]>);
    setTasks(tasks);
  }, []);

  return (
    <div className="grid grid-cols-5 gap-5">
      {columns.map((column) => (
        <Column key={column.id} {...column} tasks={tasks?.[column.id] || []} />
      ))}
    </div>
  )
}

export default Home
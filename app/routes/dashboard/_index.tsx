import { useLoaderData, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/_index";
import { TaskSidebar } from "~/components/dashboard/task-preview/TaskSidebar";

export function meta() {
  return [
    {
      title: "Inicio | Flowee",
    },
  ];
}

export async function clientAction({}: Route.ClientActionArgs) {
  alert("logout");
  return null;
}

const Home = () => {
  const { user } = useRouteLoaderData("routes/dashboard/_layout");

  return (
    <div>
      <h1>Home, {user?.name}</h1>

      <TaskSidebar task={null} />
    </div>
  );
};

export default Home;

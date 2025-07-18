import { useLoaderData, useRouteLoaderData } from "react-router";
import type { Route } from "../tasks/+types/_index";

export function meta() {
  return [
    {
      title: 'Solicitudes | Flowee',
    }
  ]
}

export async function clientAction({}: Route.ClientActionArgs) {
  alert('logout');
  return null;
}

const Home = () => {
  return (
    <div>Tareas</div>
  )
}

export default Home
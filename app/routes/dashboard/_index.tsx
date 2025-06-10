import { useLoaderData, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/_index";

export function meta() {
  return [
    {
      title: 'Inicio | Flowee',
    }
  ]
}

export async function clientAction({}: Route.ClientActionArgs) {
  alert('logout');
  return null;
}

const Home = () => {
  const { user } = useRouteLoaderData('routes/dashboard/_layout')

  return (
    <div>Home, {user?.name}</div>
  )
}

export default Home
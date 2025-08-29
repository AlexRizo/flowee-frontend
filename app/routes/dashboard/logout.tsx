import { Navigate } from "react-router";
import { logout } from "~/services/auth-service";
import type { Route } from "./+types/logout";
import { queryClient } from "~/services/queryClient";


export async function clientAction({ request }: Route.ClientActionArgs) {  
  await logout();

  queryClient.clear();

  return null;
}

export async function loader({ request }: Route.LoaderArgs) {
  await logout();
  
  request.headers.delete('Cookie');
  
  queryClient.clear();

  return null;
}

const Logout = () => <Navigate to="/auth" />;

export default Logout;

import { Navigate } from "react-router";
import { logout } from "~/services/auth-service";
import type { Route } from "./+types/logout";
import { queryClient } from "~/services/queryClient";


export async function clientAction({}: Route.ClientActionArgs) {  
  await logout();
  queryClient.clear();

  return null;
}

const Logout = () => <Navigate to="/auth" />;

export default Logout;

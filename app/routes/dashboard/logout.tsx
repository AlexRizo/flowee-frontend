import { Navigate } from "react-router";
import { logout } from "~/services/auth-service";
import type { Route } from "./+types/logout";

export async function clientAction({}: Route.ClientActionArgs) {  
  await logout();
  return null;
}

const Logout = () => <Navigate to="/auth" />;

export default Logout;

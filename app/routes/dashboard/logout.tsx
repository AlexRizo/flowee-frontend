import { Navigate, redirect } from "react-router";
import { logout } from "~/services/auth-service";
import { queryClient } from "~/services/queryClient";

export async function clientAction() {
  await logout();
  queryClient.clear();
  return redirect("/auth");
}

const Logout = () => <Navigate to="/auth" />;

export default Logout;

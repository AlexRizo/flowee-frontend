import { Navigate, redirect } from "react-router";
import { logout } from "~/services/auth-service";
import type { Route } from "./+types/logout";
import { queryClient } from "~/services/queryClient";

export async function clientAction() {
  await logout();
  queryClient.clear();
  return redirect("/auth", {
    headers: {
      "Set-Cookie":
        "access_token=; Max-Age=0; Path=/; Domain=.alowee.com; HttpOnly; Secure; SameSite=Lax",
    },
  });
}

const Logout = () => <Navigate to="/auth" />;

export default Logout;

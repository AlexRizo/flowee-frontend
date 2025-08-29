import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_layout";
import { checkAuth } from "~/services/auth-service";
import { getCookie } from "~/lib/cookies";
import { useEffect } from "react";

import { parse } from "cookie";

export async function loader({ request }: Route.LoaderArgs) {
  const authStatus = await checkAuth(getCookie(request));

  const cookie = request.headers.get("cookie");
  const requestHeaders = parse(request.headers.get("cookie") || "");

  if (authStatus.user) {
    // return redirect("/");
  }

  return { authStatus, cookie, requestHeaders };
}

const AuthLayout = ({ loaderData }: Route.ComponentProps) => {
  useEffect(() => {
    console.log({ loaderData });
    alert(JSON.stringify(loaderData));
  }, [loaderData]);
  return (
    <main className="h-screen w-screen">
      <Outlet />
    </main>
  );
};

export default AuthLayout;

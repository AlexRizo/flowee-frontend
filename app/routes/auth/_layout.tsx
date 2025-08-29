import { Outlet, redirect } from 'react-router'
import type { Route } from './+types/_layout';
import { checkAuth } from '~/services/auth-service';
import { getCookie } from '~/lib/cookies';
import { useEffect } from 'react';

export async function loader({ request }: Route.LoaderArgs) {
  const authStatus = await checkAuth(getCookie(request));

  const requestHeaders = request.headers;

  if (authStatus.user) {
    return redirect("/");
  }

  return { authStatus, requestHeaders };
}

const AuthLayout = ({ loaderData }: Route.ComponentProps) => {
  useEffect(() => {
    console.log({loaderData});
  }, [loaderData]);
  return (
    <main className='h-screen w-screen'>
      <Outlet />
    </main>
  )
}

export default AuthLayout
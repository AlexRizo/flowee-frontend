import { Outlet, redirect } from 'react-router'
import type { Route } from './+types/_layout';
import { checkAuth } from '~/services/auth-service';
import { parse } from 'cookie';
import { getCookie } from '~/lib/cookies';

export async function loader({ request }: Route.LoaderArgs) {
  const authStatus = await checkAuth(getCookie(request));

  if (authStatus.user) {
    return redirect("/");
  }

  return null;
}

const AuthLayout = () => {
  return (
    <main className='h-screen w-screen'>
      <Outlet />
    </main>
  )
}

export default AuthLayout
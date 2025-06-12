import { Outlet, redirect } from 'react-router'
import type { Route } from './+types/_layout';
import { checkAuth } from '~/services/auth-service';

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get('Cookie');
  const authStatus = await checkAuth(cookie || '');

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
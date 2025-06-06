import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <main className='h-screen w-screen'>
      <Outlet />
    </main>
  )
}

export default AuthLayout
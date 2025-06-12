import { Outlet, redirect } from "react-router"
import type { Route } from "./+types/_layout";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { getBoards } from "~/services/boards-service";
import { checkAuth, logout } from "~/services/auth-service";
import { Navbar } from "~/components/dashboard/Navbar";
import { toast, Toaster } from "sonner";
import { useEffect } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get('Cookie');
  const authStatus = await checkAuth(cookie || '');

  if (!authStatus.user) {
    request.headers.delete('Cookie');
    return redirect('/auth');
  }
  
  const { boards } = await getBoards(cookie || '');

  return {
    boards,
    user: authStatus.user,
  };
}

const DashboardLayout = ({ loaderData }: Route.ComponentProps) => {
  const { boards } = loaderData;

  useEffect(() => {
    if (!boards) toast.error('No se han encontrado tableros');
  }, [boards]);

  return ( 
    <main className="flex bg-gray-50">
      <Toaster />
      <Sidebar boards={boards || []}/>
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="p-6 h-full">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default DashboardLayout
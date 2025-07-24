import { Outlet, redirect } from "react-router"
import type { Route } from "./+types/_layout";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { getBoards } from "~/services/boards-service";
import { checkAuth } from "~/services/auth-service";
import { Navbar } from "~/components/dashboard/Navbar";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "~/services/queryClient";
import { BoardProvider, useBoardContext } from "~/context/BoardContext";
import type { User } from "~/services/interfaces/users-service.interface";
import { AuthProvider } from "~/context/AuthContext";

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
  const { boards, user } = loaderData;

  return ( 
    <QueryClientProvider client={queryClient}>
      <AuthProvider authUser={user}>
        <BoardProvider initialBoards={boards}>
          <main className="flex bg-gray-50">
            <Toaster />
            <Sidebar/>
            <div className="w-full flex flex-col">
              <Navbar user={user as User}/>
              <div className="p-6 h-full">
                <Outlet />
              </div>
            </div>
          </main>
        </BoardProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default DashboardLayout
import { Outlet, redirect } from "react-router"
import type { Route } from "./+types/_layout";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { getBoards } from "~/services/boards-service";
import { checkAuth } from "~/services/auth-service";
import { Navbar } from "~/components/dashboard/Navbar";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "~/services/queryClient";
import { BoardProvider } from "~/context/BoardContext";
import { AuthProvider } from "~/context/AuthContext";
import { SocketProvider } from "~/context/SocketContext";
import { getCookie } from "~/lib/cookies";

export async function loader({ request }: Route.LoaderArgs) {
  const access_token = getCookie(request);
  
  const authStatus = await checkAuth(access_token);

  if (!authStatus.user) {
    request.headers.delete('Cookie');
    return redirect('/auth');
  }
  
  const { boards } = await getBoards(access_token || '');

  return {
    boards,
    user: authStatus.user,
  };
}

export const shouldRevalidate = () => false;

const DashboardLayout = ({ loaderData }: Route.ComponentProps) => {
  const { boards, user } = loaderData;

  return ( 
    <QueryClientProvider client={queryClient}>
      <AuthProvider authUser={user}>
        <SocketProvider>
          <BoardProvider initialBoards={boards}>
            <main className="flex bg-gray-50">
              <Toaster />
              <Sidebar/>
              <div className="w-full flex flex-col">
                <Navbar />
                <div className="p-6 h-full">
                  <Outlet />
                </div>
              </div>
            </main>
          </BoardProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default DashboardLayout
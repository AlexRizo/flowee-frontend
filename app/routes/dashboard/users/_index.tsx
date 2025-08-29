import { UsersTable } from "~/components/dashboard/users/UsersTable";
import type { Route } from "./+types/_index";
import { createUser, getUsers } from "~/services/users-service";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { CreateUserModal } from "~/components/dashboard/users/CreateUserModal";
import { Navigate, useSubmit } from "react-router";
import { Roles } from "~/services/interfaces/users-service.interface";
import { PageLoader } from "~/components/dashboard/PageLoader";
import { useAuthContext } from "~/context/AuthContext";

export function meta() {
  return [
    {
      title: "Usuarios | Flowee",
    },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const getUsersResponse = await getUsers();

  if (getUsersResponse?.error) {
    toast.error(getUsersResponse.message!);
  }

  return {
    users: getUsersResponse.users || [],
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const user = {
    name: formData.get("name") as string,
    nickname: formData.get("nickname") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    roles: formData.get("roles")?.toString().split(",") as Roles[],
  };

  const createResponse = await createUser(user);

  return {
    message: createResponse.message,
    error: createResponse.error,
  };
}

export function HydrateFallback() {
  return <PageLoader />;
}

const Users = ({ loaderData }: Route.ComponentProps) => {
  const { protectedRoute } = useAuthContext();

  const { users } = loaderData;
  const submit = useSubmit();


  if (!protectedRoute([Roles.ADMIN, Roles.SUPER_ADMIN])) {
    return <Navigate to="/" />;
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <CreateUserModal submit={submit}>
          <Button>
            <Plus size={16} strokeWidth={1.5} />
            Nuevo usuario
          </Button>
        </CreateUserModal>
      </div>
      <UsersTable users={users} />
    </section>
  );
};

export default Users;

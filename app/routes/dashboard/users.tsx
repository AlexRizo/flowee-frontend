import { UsersTable } from "~/components/dashboard/users/UsersTable";
import type { Route } from "./+types/users";
import { getUsers } from "~/services/users-service";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { CreateUserModal } from "~/components/dashboard/users/CreateUserModal";
import { useSubmit } from "react-router";

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
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
    roles: formData.get("roles"),
  };

  console.log(user);
}

const Users = ({ loaderData }: Route.ComponentProps) => {
  const { users } = loaderData;
  const submit = useSubmit();

  return (
    <section>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <CreateUserModal submit={submit}>
          <Button>
            <Plus size={16} strokeWidth={1.5}/>
            Nuevo usuario
          </Button>
        </CreateUserModal>
      </div>
      <UsersTable users={users} />
    </section>
  );
};

export default Users;

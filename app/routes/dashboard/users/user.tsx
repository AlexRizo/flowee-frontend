import { getUser } from "~/services/users-service";
import type { Route } from "./+types/user";
import { Badge } from "~/components/ui/badge";
import { User2 } from "lucide-react";
import { getTitle } from "~/lib/utils";
import { Form } from "~/components/ui/form";
import { EditUserForm } from "~/components/dashboard/users/EditUserForm";
import type { User } from "~/services/interfaces/users-service.interface";
import { UserBoards } from "~/components/dashboard/users/UserBoards";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: getTitle(`@${params.nickname}`) },
  ]
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { nickname } = params;
  const cookie = request.headers.get('cookie') || '';

  const userResponse = await getUser(nickname, cookie);

  console.log(userResponse);
  
  return { user: userResponse.user };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const boards = formData.get("boards");
  console.log(intent, boards);
}

const User = ({ loaderData }: Route.ComponentProps) => {

  const { user } = loaderData;

  return (
    <section>
      <article className="flex items-center gap-4">
        <div role="img" className="rounded-full size-24 bg-gray-400">
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-none">{user?.name}</h1>
          <p className="text-gray-500 leading-none">{user?.email}</p>
          <div className="space-x-2 flex items-center mt-3">
            <Badge variant={ user?.isActive ? 'default' : 'destructive' }>{ user?.isActive ? 'Activo' : 'Inactivo' }</Badge>
            <Badge variant="outline" className="border-gray-300">
              <User2 size={16} />
              @{ user?.nickname }
            </Badge>
          </div>
        </div>
      </article>

    <div className="flex gap-4 mt-10 w-full justify-between">
      <div className="border border-gray-200 rounded p-6 space-y-6 w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Información personal</h2>
          <p className="text-sm text-gray-500">Información básica del usuario</p>
        </div>

        <EditUserForm user={ user } />
      </div>

      <div className="border border-gray-200 rounded p-6 space-y-6 w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Sistema</h2>
          <p className="text-sm text-gray-500">Accesos del usuario</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tableros</h3>
          <UserBoards boards={user?.boards || []} />
        </div>
      </div>
    </div>
    </section>
  )
}

export default User;
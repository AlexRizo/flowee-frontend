import { getUser, updateUser } from "~/services/users-service";
import type { Route } from "./+types/user";
import { Badge } from "~/components/ui/badge";
import { Power, User2 } from "lucide-react";
import { getTitle } from "~/lib/utils";
import { EditUserForm } from "~/components/dashboard/users/EditUserForm";
import type {
  UpdateUserResponse,
  User,
} from "~/services/interfaces/users-service.interface";
import { UserBoards } from "~/components/dashboard/users/UserBoards";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { redirect } from "react-router";
import { ToggleUserStatus } from "~/components/dashboard/users/ToggleUserStatus";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: getTitle(`@${params.nickname}`) }];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { nickname } = params;
  const cookie = request.headers.get("cookie") || "";

  const userResponse = await getUser(nickname, cookie);

  if (!userResponse || userResponse.error || !userResponse.user) {
    throw new Response(userResponse.message, { status: 404 });
  }

  return { user: userResponse.user };
}

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const userToUpdate = {
    userId: formData.get("userId") as string,
    name: (formData.get("name") as string) || undefined,
    nickname: (formData.get("nickname") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    roles: JSON.parse(formData.get("roles") as string) || undefined,
    boards: JSON.parse(formData.get("boards") as string) || undefined,
    isActive: formData.get("isActive") as string || undefined,
  };

  let updateUserResponse: UpdateUserResponse | undefined;

  const { userId, ...userData } = userToUpdate;
  updateUserResponse = await updateUser(userId, userData);
  
  if (updateUserResponse) {
    const { error, message, user } = updateUserResponse;
    if (error) {
      toast.error(message);
      return { message, error };
    } else {
      toast.success(message);

      if (user?.nickname !== params.nickname) {
        return redirect(`/usuarios/${user!.nickname}`);
      }

      return { message };
    }
  }
}

const User = ({ loaderData }: Route.ComponentProps) => {
  const { user } = loaderData;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <section>
      <article className="flex items-center gap-4 border rounded border-gray-200 p-4 bg-white">
        <div role="img" className="rounded-full size-24 bg-gray-400"></div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-none">{user?.name}</h1>
          <p className="text-gray-500 leading-none">{user?.email}</p>
          <div className="space-x-2 flex items-center mt-3">
            <Badge variant={user?.isActive ? "default" : "destructive"}>
              {user?.isActive ? "Activo" : "Inactivo"}
            </Badge>
            <Badge variant="outline" className="border-gray-300">
              <User2 size={16} />@{user?.nickname}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-auto">
          <ToggleUserStatus id={user.id} isActive={user.isActive}>
            <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:text-red-600"
          >
            <Power size={16} />
            {user.isActive ? "Desactivar" : "Activar"}
          </Button>
          </ToggleUserStatus>
        </div>
      </article>

      <div className="flex gap-4 mt-5 w-full justify-between">
        <div
          role="contentinfo"
          className="border border-gray-200 rounded p-6 space-y-6 w-full bg-white"
        >
          <div role="heading" className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold">Información personal</h2>
              <p className="text-sm text-gray-500">
                Información básica del usuario
              </p>
            </div>
            <div role="switch" className="flex gap-2">
              <Switch checked={isEditing} onCheckedChange={setIsEditing} />
              <Label>Editar</Label>
            </div>
          </div>

          <EditUserForm user={user as User} enabled={isEditing} />
        </div>

        <div className="border border-gray-200 rounded p-6 space-y-6 w-full bg-white">
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">Sistema</h2>
            <p className="text-sm text-gray-500">Accesos del usuario</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tableros</h3>
            <UserBoards boards={user.boards || []} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default User;

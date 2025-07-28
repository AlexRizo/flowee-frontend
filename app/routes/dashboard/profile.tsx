import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Pencil, User2 } from "lucide-react";
import { useAuthContext } from "~/context/AuthContext";
import { useEffect, useState } from "react";
import { type UpdateUser } from "~/services/interfaces/users-service.interface";
import type { Route } from "./+types/profile";
import { getBoards } from "~/services/boards-service";
import { toast } from "sonner";
import { UserBoards } from "~/components/dashboard/users/UserBoards";
import { getFormData } from "~/helpers/formDataHelper";
import { updateUser, uploadAvatar } from "~/services/users-service";
import { PageLoader } from "~/components/dashboard/PageLoader";
import { EditAvatar } from "~/components/dashboard/profile/EditAvatar";
import { useFetcher } from "react-router";
import { EditProfile } from "~/components/dashboard/profile/EditProfile";

export function meta() {
  return [
    {
      title: "Perfil | Flowee",
    }
  ]
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const response = await getBoards();

  if (response.error) {
    toast.error(response.message!);
  }

  return {
    boards: response.boards || [],
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  let formParams: string[] = [];

  switch (formData.get("formType")) {
    case "avatar":
      formParams = ['userId', 'file'];
      const avatarFormData = getFormData(formData, formParams);
      const { error, message, url } = await uploadAvatar(avatarFormData.userId as string, avatarFormData.file as File);

      if (error) {
        toast.error(error, {
          description: message,
        });
      }
      
      return {
        error: error ?? null,
        message: message ?? null,
        url: url ?? null
      };
    case "profile":
      formParams = ['userId', 'name', 'nickname', 'email', 'password'];
      const { userId, password, ...userFormData } = getFormData(formData, formParams);

      userFormData.password =  (password === 'undefined' || password === '' || !password) ? undefined : password;
      
      const response = await updateUser(userId, userFormData as UpdateUser);
      
      if (response.error) {
        toast.error(response.error, {
          description: response.message,
        });
      }
      
      return {
        message: response.message ?? null,
        user: response.user ?? null,
      };
  }
}

export function HydrateFallback() {
  return <PageLoader />;
}

const Profile = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { user, setUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);

  const avatarFetcher = useFetcher();

  useEffect(() => {
    if (avatarFetcher.data?.url) {
      setUser({ ...user, avatar: avatarFetcher.data.url });
      toast.success(avatarFetcher.data.message);
    }
  }, [avatarFetcher.data])

  useEffect(() => {
    if (actionData?.user) {
      toast.success(actionData.message);
      setUser({ ...user, ...actionData.user });
    }
  }, [actionData]);
  
  return (
    <section>
      <article className="flex items-center gap-4 border rounded border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-center size-24 relative">
          <img src={user.avatar ? user.avatar : '/images/default-user.webp'} className="rounded-full size-full object-cover"></img>
          <div className="flex items-center justify-center absolute size-full bg-white/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <EditAvatar fetcher={avatarFetcher} userId={user.id} avatar={user.avatar}>
              <button className="bg-gray-100 rounded-full size-10 flex items-center justify-center cursor-pointer">
                <Pencil />
              </button>
            </EditAvatar>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-none">{user?.name}</h1>
          <p className="text-gray-500 leading-none">{user?.email}</p>
          <div className="space-x-2 flex items-center mt-3">
            <Badge variant="outline" className="border-gray-300">
              <User2 size={16} />@{user?.nickname}
            </Badge>
            <Badge variant="default">Activo</Badge>
          </div>
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

          <EditProfile user={user} enabled={isEditing} />
        </div>

        <div className="border border-gray-200 rounded p-6 space-y-6 w-full bg-white">
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">Sistema</h2>
            <p className="text-sm text-gray-500">Accesos del usuario</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tableros</h3>
            <UserBoards boards={loaderData.boards} allowAddBoards={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;

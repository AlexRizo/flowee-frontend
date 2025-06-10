import { getTitle } from "~/lib/utils";
import type { Route } from "./+types/_index";
import { LoginForm } from "~/components/auth/LoginForm";
import { redirect, useNavigation, useSubmit } from "react-router";
import { login } from "~/services/auth-service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: getTitle("Iniciar sesión") },
    {
      name: "description",
      content: "¡Bienvenido/a a Flowee! Inicia sesión para continuar.",
    },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const loginResponse = await login(
    email,
    password
  );

  if (loginResponse.error) {
    console.error(loginResponse);
    return {
      message: loginResponse.message,
    }
  }

  return redirect('/');
};

const Auth = ({ actionData }: Route.ComponentProps) => {
  const navigation = useNavigation();
  const submit = useSubmit();

  const formState = navigation.state;
  
  return (
    <section className="h-full w-full flex">
      <aside className="h-full w-6/10 bg-gradient-to-tr from-purple-500 to-pink-500 py-10 px-18 flex flex-col justify-between">
        <img src="./images/alowee-blanco.webp" alt="Flowee" className="w-32" />
        <p className="text-white">
          Sistema de control de solicitudes de diseño, video, bugs,
          <br /> proyectos o actualizaciones.
        </p>
      </aside>
      <div className="w-4/10 flex flex-col justify-center items-center relative">
        <div className="w-[490px] px-10">
          <h1 className="text-7xl font-bold text-gray-950">©Flowee</h1>
          <h2 className="text-2xl font-bold mt-4 text-gray-950">
            Bienvenido/a.
          </h2>
          <p className="text-sm text-muted-foreground mb-7">
            Inicia sesión para continuar
          </p>
          <LoginForm submit={submit} formState={formState} />
          {actionData?.message && formState === 'idle' && (
            <p className="text-red-500 text-sm mt-4 text-center">{ actionData.message }</p>
          )}
        </div>
        <div className="flex items-center gap-2 absolute bottom-10">
          <img src="./images/alowee-negro.webp" alt="Alowee" className="w-20" />
          <small className="text-foreground">
            © 2025 Alowee. Todos los derechos Reservados.
          </small>
        </div>
      </div>
    </section>
  );
};

export default Auth;

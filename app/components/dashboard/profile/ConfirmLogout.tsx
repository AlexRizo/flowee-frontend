import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { AlertDialogContent } from "~/components/ui/alert-dialog";
import { AlertDialogHeader } from "~/components/ui/alert-dialog";
import type { FC } from "react";
import { ButtonSubmit } from "~/components/ButtonSubmit";

interface Props {
  children: React.ReactNode;
  state: "idle" | "loading" | "submitting";
  formId: string;
}

export const ConfirmLogout: FC<Props> = ({ children, state, formId }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Alerta por cambio de correo/contraseña
          </AlertDialogTitle>
          <AlertDialogDescription>
            Por seguridad, deberás iniciar sesión nuevamente al cambiar tu
            correo o contraseña.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <ButtonSubmit
              className="w-min"
              state={state}
              loadingText="Espera"
              submitText="Aceptar"
              formId={formId}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

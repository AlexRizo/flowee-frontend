import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { useSubmit } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export const ToggleUserStatus = ({
  children,
  id,
  isActive,
}: {
  children: React.ReactNode;
  id: string;
  isActive: boolean;
}) => {
  const submit = useSubmit();
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useNavigation();
  
  const handleToggleUserStatus = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const formData = new FormData();

    formData.append("userId", id);
    formData.append("isActive", !isActive ? "true" : "false");

    submit(formData, { method: "patch" });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="border-gray-300">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Puedes volver a cambiar el estado de este usuario en cualquier
            momento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Form onSubmit={handleToggleUserStatus}>
            <AlertDialogAction type="submit" disabled={state !== "idle"}>
              {isActive ? "Desactivar" : "Activar"}
            </AlertDialogAction>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

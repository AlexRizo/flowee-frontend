import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MultipleSelect } from "../MultipleSelect";
import { Roles } from "~/services/interfaces/users-service.interface";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitFunction } from "react-router";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(50, { message: "El usuario no puede tener más de 50 caracteres" }),
  nickname: z
    .string()
    .min(1, { message: "El usuario es requerido" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "El usuario solo puede contener letras y números",
    })
    .max(15, { message: "El usuario no puede tener más de 20 caracteres" }),
  email: z
    .string()
    .email({ message: "El correo electrónico no es válido" })
    .max(20, {
      message: "El correo electrónico no puede tener más de 20 caracteres",
    }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/,
      {
        message:
          "La contraseña debe tener una letra mayúscula, una letra minúscula, un número y un carácter especial",
      }
    )
    .max(50, { message: "La contraseña no puede tener más de 50 caracteres" }),
  roles: z
    .array(z.nativeEnum(Roles, { message: "Los roles no son válidos" }), {
      message: "Los roles son requeridos",
    })
    .min(1, { message: "Los roles son requeridos" }),
});

export const CreateUserModal = ({
  children,
  submit,
}: {
  children: React.ReactNode;
  submit: SubmitFunction;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nickname: "",
      email: "",
      password: "",
      roles: [],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    submit(data, {
      method: "post",
    });
  };

  const roles = [
    {
      label: "Administrador",
      value: Roles.ADMIN,
    },
    {
      label: "Super administrador",
      value: Roles.SUPER_ADMIN,
    },
    {
      label: "Publicador",
      value: Roles.PUBLISHER,
    },
    {
      label: "Diseñador",
      value: Roles.DESIGNER,
    },
    {
      label: "Gestor de diseño",
      value: Roles.DESIGN_MANAGER,
    },
    {
      label: "Gestor de publicaciones",
      value: Roles.PUBLISHER_MANAGER,
    },
    {
      label: "Lector",
      value: Roles.READER,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-gray-300">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <DialogDescription>
            Crea un nuevo usuario para tu organización.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Perez" {...field} maxLength={50} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan_perez" {...field} maxLength={15} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="juan.perez@email.com"
                      {...field}
                      maxLength={20}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="Abc123+?-" {...field} maxLength={50} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Debe contener:
                    <span className="flex flex-col">
                      <span className='before:content-["-"]'>
                        {" "}
                        Al menos 6 caracteres.
                      </span>
                      <span className='before:content-["-"]'>
                        {" "}
                        Una letra mayúscula.
                      </span>
                      <span className='before:content-["-"]'>
                        {" "}
                        Una letra minúscula.
                      </span>
                      <span className='before:content-["-"]'> Un número.</span>
                      <span className='before:content-["-"]'>
                        {" "}
                        Un carácter especial.
                      </span>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <MultipleSelect
                      options={roles}
                      value={[]}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

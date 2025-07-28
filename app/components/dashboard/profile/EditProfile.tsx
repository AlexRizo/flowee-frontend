import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigation, useSubmit } from "react-router";
import { z } from "zod";
import { ButtonSubmit } from "~/components/ButtonSubmit";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadcnForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { createFormData } from "~/helpers/formDataHelper";
import type { AuthUser } from "~/services/interfaces/auth-service.interface";
import { ConfirmLogout } from "./ConfirmLogout";
import { Button } from "~/components/ui/button";

interface Props {
  user: AuthUser;
  enabled: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  nickname: z
    .string()
    .min(3, { message: "El usuario debe tener al menos 3 caracteres" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "El usuario solo puede contener letras, números y guiones bajos",
    })
    .optional(),
  password: z
    .string()
    .refine(
      (value) => {
        if (!value) {
          return true;
        } else if (
          value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
        ) {
          return true;
        } else {
          return false;
        }
      },
      {
        message:
          "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial",
      }
    )
    .optional(),
});

export const EditProfile: FC<Props> = ({ user, enabled }) => {
  const { state } = useNavigation();
  const submit = useSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      nickname: user.nickname,
      password: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = createFormData({
      ...data,
      userId: user.id,
      formType: "profile",
    });

    submit(formData, {
      method: "PATCH",
    });
  };

  const email = form.watch("email");
  const password = form.watch("password");

  const userChanged = useMemo(() => {
    return user.email !== email ||
      (password?.length ?? 0) > 0
  }, [email, password]);
  
  return (
    <ShadcnForm {...form}>
      <Form
        id="edit-profile"
        onSubmit={form.handleSubmit(onSubmit)}
        className={`${
          !enabled && "opacity-60 pointer-events-none"
        } transition-opacity space-y-4`}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nombre completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nombre de usuario</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nombre de usuario"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {userChanged ? (
          <ConfirmLogout state={state} formId="edit-profile">
            <Button type="button" className="w-full">
              Guardar
            </Button>
          </ConfirmLogout>
        ) : (
          <ButtonSubmit
            state={state}
            loadingText="Guardando"
            submitText="Guardar"
            formId="edit-profile"
          />
        )}
      </Form>
    </ShadcnForm>
  );
};

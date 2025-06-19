import { useForm } from "react-hook-form";
import { Form, useNavigation, useSubmit } from "react-router";
import {
  Form as ShadcnForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { InfoTooltip } from "~/components/InfoTooltip";
import { z } from "zod";
import {
  roles,
  Roles,
  type User,
} from "~/services/interfaces/users-service.interface";
import { MultipleSelect } from "../MultipleSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonSubmit } from "~/components/ButtonSubmit";

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }).optional(),
  nickname: z
    .string()
    .min(1, { message: "El usuario es requerido" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "El usuario solo puede contener letras, números y guiones bajos" })
    .optional(),
  email: z
    .string()
    .email({ message: "El correo electrónico no es válido" })
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
  roles: z
    .array(z.nativeEnum(Roles))
    .min(1, { message: "El rol es requerido" })
    .optional(),
});

export const EditUserForm = ({
  user,
  enabled,
}: {
  user: User;
  enabled: boolean;
}) => {
  const { state } = useNavigation();
  const submit = useSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      password: undefined,
      roles: user.roles,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    formData.append("userId", user.id);

    submit(formData, {
      method: "PATCH",
    });
  };

  return (
    <ShadcnForm {...form}>
      <Form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-4 ${!enabled && "opacity-50 pointer-events-none"}`}
      >
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
              <FormLabel>
                Contraseña
                <InfoTooltip text="La contraseña debe contener al menos 6 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial." />
              </FormLabel>
              <FormControl>
                <Input placeholder="Abc123+?-" {...field} maxLength={50} />
              </FormControl>
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
                  value={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonSubmit
          state={state}
          loadingText="Guardando..."
          submitText="Guardar"
        />
      </Form>
    </ShadcnForm>
  );
};

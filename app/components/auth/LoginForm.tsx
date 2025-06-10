import { useForm } from "react-hook-form";
import { Form, type SubmitFunction } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form as ShadForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "El email es obligatorio",
    })
    .email({
      message: "El email no es válido",
    }),
  password: z.string().min(1, {
    message: "La contraseña es obligatoria",
  }),
});

export const LoginForm = ({
  submit,
  formState,
}: {
  submit: SubmitFunction;
  formState: "idle" | "submitting" | "loading";
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    submit(data, {
      method: "post",
    });
  };

  return (
    <ShadForm {...form}>
      <Form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder="ejemplo@gmail.com"
                  {...field}
                  type="email"
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
                <Input placeholder="Contraseña" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={formState === "submitting"}>
          {formState === "submitting" ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </Form>
    </ShadForm>
  );
};

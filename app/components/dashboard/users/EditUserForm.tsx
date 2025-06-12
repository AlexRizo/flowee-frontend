import { useForm } from "react-hook-form"
import { Form } from "react-router"
import { Form as ShadcnForm, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { InfoTooltip } from "~/components/InfoTooltip"
import { z } from "zod"
import { roles, Roles, type User } from "~/services/interfaces/users-service.interface"
import { MultipleSelect } from "../MultipleSelect"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  nickname: z.string().min(1, { message: "El usuario es requerido" }),
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  password: z.string().min(6, { message: "La contraseña debe contener al menos 6 caracteres" }),
  roles: z.array(z.nativeEnum(Roles)).min(1, { message: "El rol es requerido" }),
})

export const EditUserForm = ({ user }: { user: User }) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      password: "",
      roles: user.roles,
    },
  })
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }
  
  return (
    <ShadcnForm {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </ShadcnForm>
  )
}

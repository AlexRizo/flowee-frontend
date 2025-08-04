import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DateTimePicker } from "~/components/DateTimePicker";
import { SingleSelect } from "~/components/SingleSelect";
import { Button } from "~/components/ui/button";
import { FormControl, FormMessage } from "~/components/ui/form";
import { Form, FormLabel, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Priority } from "~/services/interfaces/tasks-service.interface";

export function meta() {
  return [
    {
      title: "Crear: solicitud especial | Flowee",
    },
  ];
}

const schema = z.object({
  title: z.string().min(1, { message: "El nombre de la solicitud es requerido" }),
  dueDate: z.date({
    required_error: "La fecha de entrega es requerida",
  }).min(new Date(), { message: "La fecha de entrega debe ser mayor a la fecha actual" }),
  priority: z.nativeEnum(Priority, { message: "La prioridad es requerida" }),
})

const SpecialTask = () => {

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      title: "",
      dueDate: undefined,
      priority: Priority.LOW,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: any) => {
    console.log(data);
  };
  
  return (
    <>
      <header>
        <h1 className="text-center text-xl font-bold mb-8">
          Información General
        </h1>
        <p>
          Llena este formulario con los detalles de tu solicitud para que
          nuestro equipo de diseño pueda ayudarte de manera efectiva. ¡Entre más
          claro seas, mejor será el resultado!
        </p>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full mt-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del proyecto o campaña* (?)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Campaña Día del Padre | Mayo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-1.5 items-start">
            <DateTimePicker
              control={form.control}
              setValue={form.setValue}
              name="dueDate"
              label="Fecha de y hora de entrega*"
              className="w-75"
            />
            <SingleSelect
              control={form.control}
              name="priority"
              label="Prioridad*"
              options={[
                { label: "Baja", value: Priority.LOW },
                { label: "Normal", value: Priority.NORMAL },
                { label: "Alta", value: Priority.HIGH },
                { label: "Urgente", value: Priority.URGENT },
              ]}
              className="w-40"
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default SpecialTask;

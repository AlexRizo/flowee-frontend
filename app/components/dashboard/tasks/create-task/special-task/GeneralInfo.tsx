import { useEffect, type FC } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { DateTimePicker } from "~/components/DateTimePicker";
import { SingleSelect } from "~/components/SingleSelect";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "../SubmitButton";
import { useCreateTaskContext } from "~/context/CreateTaskContext";
import { Priority } from "~/services/interfaces/tasks-service.interface";

const schema = z.object({
  title: z.string().min(1, { message: "El nombre de la solicitud es requerido" }),
  dueDate: z.date({
    required_error: "La fecha de entrega es requerida",
  }).min(new Date(), { message: "La fecha de entrega debe ser mayor a la fecha actual" }),
  priority: z.nativeEnum(Priority, { message: "La prioridad es requerida" }),
})

export const GeneralInfo: FC = () => {
  const { handleSetSpecialTask, step, nextStep } = useCreateTaskContext();
  
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      title: "",
      dueDate: undefined,
      priority: Priority.LOW,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: z.infer<typeof schema>): void => {
    handleSetSpecialTask(data);
    nextStep();
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 size-full mt-10 flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nombre del proyecto o campaña* (?)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Campaña Día del Padre | Mayo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-1.5 items-start w-full">
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
          <SubmitButton status="idle" className="mt-auto" />
        </form>
      </Form>
    </>
  );
};

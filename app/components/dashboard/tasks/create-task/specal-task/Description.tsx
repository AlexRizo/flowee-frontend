import { type FC } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "../SubmitButton";
import { useCreateTaskContext } from "~/context/CreateTaskContext";
import { Textarea } from "~/components/ui/textarea";
import { FileUpload } from "~/components/FileUpload";

const schema = z.object({
  description: z.string().min(1, { message: "La descripción es requerida" }),
  files: z
    .array(z.instanceof(File), { message: "Los archivos son requeridos" })
    .min(1, { message: "Debes subir al menos un archivo" })
    .max(5, { message: "Solo puedes subir 5 archivos" }),
});

export const Description: FC = () => {
  const { handleSetSpecialTask, nextStep } = useCreateTaskContext();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      description: "",
      files: undefined,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>): void => {
    handleSetSpecialTask(data);
    nextStep();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 size-full mt-10 flex flex-col items-center"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                ¿Qué necesitas? Describe tu idea y sube lo que creas útil como
                referencia(?).
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe aquí..."
                  maxLength={1000}
                  className="resize-none field-sizing-fixed"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FileUpload
          control={form.control}
          label="Arrastra los archivos de referencia aquí"
          multiple={true}
          maxSize={50}
        />

        <SubmitButton status="idle" className="mt-auto" />
      </form>
    </Form>
  );
};

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

const MAX_FILE_SIZE = 50;
const ACCEPTED_FILES = [
  // ? Imágenes
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

const schema = z.object({
  sizes: z
    .string()
    .min(1, { message: "Las medidas son requeridas" })
    .max(100, { message: "Máximo 100 caracteres" }),
  files: z
    .array(z.instanceof(File))
    .min(1, { message: "Debes subir al menos un archivo" })
    .max(5, { message: "Solo puedes subir 5 archivos" })
    .refine(
      (files) =>
        files.every((file) => file.size <= MAX_FILE_SIZE * 1024 * 1024),
      {
        message: `Los archivos son demasiado grandes, el tamaño máximo es de ${MAX_FILE_SIZE}MB`,
      }
    )
    .refine(
      (files) => files.every((file) => ACCEPTED_FILES.includes(file.type)),
      {
        message:
          "Los archivos no son válidos. Solo se permiten imágenes y documentos",
      }
    ),
});

export const TecnicalDetails: FC = () => {
  const { handleSetSpecialTask, nextStep } = useCreateTaskContext();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      sizes: "",
      files: [],
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>): void => {
    handleSetSpecialTask({
      sizes: data.sizes,
      referenceFiles: data.files,
    });
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
          name="sizes"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Agrega las medidas*</FormLabel>
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
          maxSize={MAX_FILE_SIZE}
        />

        <SubmitButton status="idle" className="mt-auto" />
      </form>
    </Form>
  );
};

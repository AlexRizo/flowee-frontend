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
  legals: z
    .string()
    .max(500, { message: "Máximo 500 caracteres" })
    .optional(),
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
  const { handleSetSpecialTask, nextStep, specialTask } = useCreateTaskContext();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      sizes: specialTask.sizes,
      files: specialTask.includeFiles,
      legals: specialTask.legals,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = ({ files, sizes, legals }: z.infer<typeof schema>): void => {
    handleSetSpecialTask({
      sizes,
      legals,
      includeFiles: files,
    });
    nextStep();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 size-full mt-10 flex flex-col items-center"
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
                  maxLength={100}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legals"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Si tu solicitud lleva legales, ponlos en este apartado</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe aquí..."
                  maxLength={500}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FileUpload
          initialFiles={specialTask.includeFiles}
          control={form.control}
          label="Arrastra los archivos para incluir en el diseño aquí"
          multiple={true}
          maxSize={MAX_FILE_SIZE}
        />

        <SubmitButton className="mt-auto" />
      </form>
    </Form>
  );
};

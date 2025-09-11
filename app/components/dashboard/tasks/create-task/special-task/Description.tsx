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

const MAX_FILE_SIZE = 10;
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
  // ? Documentos
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "text/plain",
  "text/rtf",
];

const schema = z.object({
  description: z.string().min(1, { message: "La descripción es requerida" }),
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

export const Description: FC = () => {
  const { handleSetSpecialTask, nextStep, specialTask } = useCreateTaskContext();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      description: specialTask.description,
      files: specialTask.referenceFiles,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>): void => {
    handleSetSpecialTask({
      description: data.description,
      referenceFiles: data.files,
    });
    nextStep();
  };

  return (
    <>
      <header>
        <h1 className="text-center text-xl font-bold">
          Descripción
          </h1>
      </header>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 size-full mt-10 flex flex-col items-center"
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
          initialFiles={specialTask.referenceFiles}
          control={form.control}
          label="Archivos de referencia"
          description="Arrastra los archivos de referencia aquí"
          multiple={true}
          maxSize={MAX_FILE_SIZE}
        />

        <SubmitButton className="mt-auto" />
        </form>
      </Form>
    </>
  );
};

import { useState, type FC } from "react";
import { Sheet } from "~/components/ui/sheet";
import { SheetTrigger } from "~/components/ui/sheet";
import { SheetContent } from "~/components/ui/sheet";
import { SheetHeader } from "~/components/ui/sheet";
import { SheetTitle } from "~/components/ui/sheet";
import { SheetDescription } from "~/components/ui/sheet";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadcnForm,
  FormDescription,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { FormField } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskPreview } from "~/context/TaskPreviewContext";
import { Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";

interface Props {
  children: React.ReactNode;
  deliveryId: string;
  deliveryDescription: string;
}

const MAX_FILE_SIZE = 50;
const ACCEPTED_FILES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
];

const schema = z.object({
  description: z
    .string()
    .min(1, { message: "La descripción es requerida" })
    .max(35, { message: "La descripción no puede tener más de 35 caracteres" }),
  deliveryId: z.string().min(1, { message: "La entrega es requerida" }),
  file: z
    .instanceof(File, { message: "El archivo es requerido" })
    .refine((file) => file.size <= MAX_FILE_SIZE * 1024 * 1024, {
      message: `Los archivos son demasiado grandes, el tamaño máximo es de ${MAX_FILE_SIZE}MB`,
    })
    .refine((file) => ACCEPTED_FILES.includes(file.type), {
      message:
        "Los archivos no son válidos. Solo se permiten imágenes",
    }),
});

export const CreateVersion: FC<Props> = ({
  children,
  deliveryId = "",
  deliveryDescription,
}) => {
  const { handleCreateVersion, isLoadingCreateVersion } = useTaskPreview();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    form.reset();
  };

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      description: "",
      deliveryId,
      file: undefined,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    handleCreateVersion(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nuevo entregable</SheetTitle>
          <SheetDescription>
            Agrega un entregable para el formato:{" "}
            <span className="font-bold">{deliveryDescription}</span>
          </SheetDescription>
        </SheetHeader>
        <ShadcnForm {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-4 flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={50}
                      placeholder="Describe la versión"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diseño</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_FILES.join(", ")}
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Sube el diseño de la versión
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoadingCreateVersion}
              type="submit"
              className="ml-auto"
            >
              {isLoadingCreateVersion ? (
                <Loader2 className="animate-spin repeat-infinite" />
              ) : (
                "Crear versión"
              )}
            </Button>
          </form>
        </ShadcnForm>
      </SheetContent>
    </Sheet>
  );
};

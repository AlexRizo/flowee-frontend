import React, { useState, type FC } from "react";
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
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { FormField } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskPreview } from "~/context/TaskPreviewContext";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  taskId: string;
}

const schema = z.object({
  description: z
    .string()
    .min(1, { message: "La descripción es requerida" })
    .max(35, { message: "La descripción no puede tener más de 35 caracteres" }),
});

export const CreateFormat: FC<Props> = ({ children, taskId }) => {
  const { handleCreateFormat, isLoadingCreateFormat } = useTaskPreview();
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      description: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    handleCreateFormat(data);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Solicitar otro Formato</SheetTitle>
          <SheetDescription>
            Agrega los detalles del formato que deseas solicitar.
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
                      placeholder="Describe el formato que deseas solicitar"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoadingCreateFormat}
              type="submit"
              className="ml-auto"
            >
              {isLoadingCreateFormat ? (
                <Loader2 className="animate-spin repeat-infinite" />
              ) : (
                "Crear formato"
              )}
            </Button>
          </form>
        </ShadcnForm>
      </SheetContent>
    </Sheet>
  );
};

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { useEffect, useRef, type FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToggleDelivery } from "~/hooks/useToggleDelivery";
import { DeliveryStatus } from "~/services/interfaces/deliveries-interface";

const formSchema = z.object({
  comments: z
    .string()
    .min(1, { message: "Los comentarios son requeridos" })
    .max(100, { message: "Solo se permiten 100 caracteres" }),
  deliveryId: z.string(),
});

interface Props {
  deliveryId: string;
  children: React.ReactNode;
}

export const RejectForm: FC<Props> = ({ deliveryId, children }) => {
  const { toggleDelivery, isPending, message, reset } = useToggleDelivery();

  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  
  const form = useForm({
    defaultValues: {
      comments: "",
      deliveryId,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toggleDelivery({
      delivertId: data.deliveryId,
      status: DeliveryStatus.REJECTED,
      comments: data.comments,
    });
  };

  const watchForDialogToggle = (open: boolean) => {
    if (!open) {
      form.reset();
      reset();
    }
  };

  useEffect(() => {
    if (!isPending && message && dialogCloseRef.current) {
      dialogCloseRef.current.click();
    }
  }, [dialogCloseRef, isPending, message]);

  return (
    <Dialog onOpenChange={watchForDialogToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rechazar entrega</DialogTitle>
          <DialogDescription>
            Escribe el motivo por el cual rechazas esta entrega.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={100}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild ref={dialogCloseRef}>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Espera..." : "Marcar como rechazada"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

import { useMutation } from "@tanstack/react-query";
import { updateDeliveryStatus } from "~/services/deliveries-service";
import { DeliveryStatus } from "~/services/interfaces/deliveries-interface";
import { toast } from "sonner";

export const useToggleDelivery = () => {
  const {
    mutate: toggleDelivery,
    isPending,
    data: message,
    reset,
  } = useMutation({
    mutationFn: async ({
      delivertId,
      status,
      comments,
    }: {
      delivertId: string;
      comments?: string;
      status: DeliveryStatus.ACCEPTED | DeliveryStatus.REJECTED;
    }) => {
      const { message } = await updateDeliveryStatus(delivertId, {
        status,
        comments,
      });

      toast.info(message);

      return message;
    },
  });

  return { toggleDelivery, isPending, message, reset };
};

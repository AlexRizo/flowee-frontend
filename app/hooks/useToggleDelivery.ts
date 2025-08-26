import { useMutation } from "@tanstack/react-query";
import { updateDeliveryStatus } from "~/services/deliveries-service";
import { DeliveryStatus } from "~/services/interfaces/deliveries-interface";
import { toast } from "sonner";
import { useTaskPreview } from "~/context/TaskPreviewContext";

export const useToggleDelivery = () => {
  const { handleUpdateDeliveryStatus } = useTaskPreview();

  const {
    mutate: toggleDelivery,
    isPending,
    data: message,
    reset,
  } = useMutation({
    mutationFn: async ({
      formatId,
      delivertId,
      status,
      comments,
    }: {
      formatId: string;
      delivertId: string;
      comments?: string;
      status: DeliveryStatus.ACCEPTED | DeliveryStatus.REJECTED;
    }) => {
      const { message } = await updateDeliveryStatus(delivertId, {
        status,
        comments,
      });

      toast.info(message);

      handleUpdateDeliveryStatus(formatId, delivertId, status, comments);

      return message;
    },
  });

  return { toggleDelivery, isPending, message, reset };
};

import { useMutation } from "@tanstack/react-query";
import { updateVersionStatus } from "~/services/versions-service";
import { VersionStatus } from "~/services/interfaces/versions-interface";
import { toast } from "sonner";
import { useTaskPreview } from "~/context/TaskPreviewContext";

interface ToggleVersionProps {
  deliveryId: string;
  versionId: string;
  comments?: string;
  status: VersionStatus.ACCEPTED | VersionStatus.REJECTED;
}

export const useToggleVersion = () => {
  const { handleUpdateVersionStatus } = useTaskPreview();

  const {
    mutate: toggleVersion,
    isPending,
    data: message,
    reset,
  } = useMutation({
    mutationFn: async ({
      deliveryId,
      versionId,
      status,
      comments,
    }: ToggleVersionProps) => {
      const { message } = await updateVersionStatus(versionId, {
        status,
        comments,
      });

      toast.info(message);

      handleUpdateVersionStatus(deliveryId, versionId, status, comments);

      return message;
    },
  });

  return { toggleVersion, isPending, message, reset };
};

import { api, getErrorMessage } from "./api";
import type { DeliveryStatus } from "./interfaces/deliveries-interface";

interface UpdateDeliveryStatus {
  status: DeliveryStatus.ACCEPTED | DeliveryStatus.REJECTED;
  comments?: string;
}

export const updateDeliveryStatus = async (
  deliveryId: string,
  data: UpdateDeliveryStatus
) => {
  return await api
    .patch(`deliveries/${deliveryId}/status`, data)
    .then((response) => {
      if ("error" in response) {
        return {
          message: getErrorMessage(response.message),
        };
      }

      return {
        message: response.message,
      };
    });
};

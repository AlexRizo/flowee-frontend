import { api, getErrorMessage } from "./api";

export const updateDeliveryStatus = async (
  deliveryId: string,
  data: { status: boolean; comments?: string }
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

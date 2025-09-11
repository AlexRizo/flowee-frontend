import { api, getErrorMessage } from "./api";
import type { VersionStatus } from "./interfaces/versions-interface";

interface UpdateVersionStatus {
  status: VersionStatus.ACCEPTED | VersionStatus.REJECTED;
  comments?: string;
}

export const updateVersionStatus = async (
  versionId: string,
  data: UpdateVersionStatus
) => {
  return await api
    .patch(`versions/${versionId}/status`, data)
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

export const updateDoneUrl = async (versionId: string, doneUrl: string) => {
  return await api
    .patch(`versions/${versionId}/done-url`, { doneUrl })
    .then((response: { message: string; error: string }) => {
      return {
        message: response.message,
      };
    });
};
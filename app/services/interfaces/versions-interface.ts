export enum VersionStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface CreateVersion {
  description: string;
  deliveryId: string;
  file: File;
}

export interface Version {
  id: string;
  filename: string;
  deliveryId: string;
  description: string;
  comments: string | null;
  key: string;
  doneUrl: string | null;
  url: string;
  status: VersionStatus;
  createdAt: string;
}
export enum DeliveryStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface CreateDelivery {
  description: string;
  formatId: string;
  file: File;
}

export interface Delivery {
  id: string;
  filename: string;
  formatId: string;
  description: string;
  comments: string | null;
  key: string;
  url: string;
  status: DeliveryStatus;
  createdAt: string;
}
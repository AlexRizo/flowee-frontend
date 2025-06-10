export interface Board {
  id: string;
  name: string;
  slug: string;
  prefix: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardsResponse {
  boards?: Board[];
  message?: string;
  error?: string;
  statusCode?: number;
}
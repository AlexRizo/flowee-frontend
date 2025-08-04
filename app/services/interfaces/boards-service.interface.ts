export interface Board {
  id: string;
  name: string;
  slug: string;
  prefix: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestResponse {
  message?: string;
  error?: string;
  statusCode?: number;

}

export interface BoardResponse extends RestResponse {
  board: Board;
}

export interface BoardsResponse extends RestResponse {
  boards: Board[];
}
export interface ApiProps {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  body?: any;
  headers?: any;
}
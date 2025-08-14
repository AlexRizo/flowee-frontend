import { parse } from "cookie";

export const getCookie = (request: Request) => {
  const { access_token } = parse(request.headers.get("Cookie") || '');

  return access_token
}
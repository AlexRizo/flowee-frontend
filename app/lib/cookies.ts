import { createCookie, redirect } from "react-router";

export const getCookie = async (request: Request) => {
  const cookie = request.headers.get("Cookie")

  if (!cookie) {
    throw new Error("No se encontró la cookie")
  }

  return cookie
}
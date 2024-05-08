import { getCookie } from "cookies-next";

export function getToken() {
  return getCookie("token");
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL;
}

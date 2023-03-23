import { LoginInterface, User } from "../types/user";
import { fetchAPI } from "./helpers";

export interface CSRF_TOKEN {
  token: string;
  header: string;
}

export const fetchRegister = (input: LoginInterface) =>
  fetchAPI<User>("/auth/local/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const fetchLogin = async (input: LoginInterface) =>
  fetchAPI<User>("/auth/local", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const fetchLogout = async () => {
  await fetchAPI("/auth/local/logout");
  return true;
};

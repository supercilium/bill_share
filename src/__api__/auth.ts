import {
  ForgotPasswordInterface,
  LoginInterface,
  ResetPasswordInterface,
  User,
} from "../types/user";
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

export const fetchConfirm = async (token: string) =>
  fetchAPI<void>(`/auth/local/registration/confirm?token=${token}`, {
    method: "POST",
  });

export const forgotPassword = async (input: ForgotPasswordInterface) =>
  fetchAPI<void>(`/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify(input),
  });

export type ResetPasswordDTO = Omit<
  ResetPasswordInterface,
  "passwordConfirmation"
>;

export const resetPassword = async (input: ResetPasswordDTO) =>
  fetchAPI<User>(`/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify(input),
  });

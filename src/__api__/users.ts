import { UserEventData } from "../types/events";
import { ChangePasswordDTO, User } from "../types/user";
import { fetchAPI } from "./helpers";

export const fetchUser = async () => fetchAPI<User>("/users/me");

export const sendCode = async () => fetchAPI<void>("/users/confirm");

export const changePassword = async (input: ChangePasswordDTO) =>
  fetchAPI<void>("/users/change-password", {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const createUser = async (input: UserEventData) =>
  fetchAPI<User>(`/users`, { method: "POST", body: JSON.stringify(input) });

import { UserEventData } from "../types/events";
import { ChangePasswordDTO, User } from "../types/user";
import { ErrorRequest, fetchAPI, getURL } from "./helpers";

export const fetchUser = async () => fetchAPI<User>("/users/me");

export type CreateUserDTO = Omit<UserEventData, "currentUser">;

export const createUser = async (input: CreateUserDTO) =>
  fetchAPI<User>(`/users`, { method: "POST", body: JSON.stringify(input) });
export const sendCode = async () => fetchAPI<void>("/users/confirm");

export const changePassword = async (input: ChangePasswordDTO) =>
  fetchAPI<void>("/users/change-password", {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const changeUser = async (input: FormData) => {
  const response = await fetch(getURL("/users"), {
    credentials: "include",
    method: "PUT",
    body: input,
  });
  try {
    if (response.ok) {
      if (response.status === 204) {
        return;
      }
      const data = await response.json();
      return data;
    } else {
      if (response.status === 401) {
        return Promise.reject<ErrorRequest>({
          status: 401,
        });
      }
      const error = await response.json();
      return Promise.reject<ErrorRequest>(error);
    }
  } catch (err) {
    return Promise.reject<ErrorRequest>(err);
  }
};

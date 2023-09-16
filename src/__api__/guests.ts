import { User } from "../types/user";
import { fetchAPI } from "./helpers";

export const fetchUser = async () => fetchAPI<User>("/users/me");

export type CreateGuestDTO = {
  partyId: string;
  userName: string;
};

export const createGuest = async (input: CreateGuestDTO) =>
  fetchAPI<User>(`/guests`, { method: "POST", body: JSON.stringify(input) });

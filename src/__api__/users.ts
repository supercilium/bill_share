import { UserEventData } from "../types/events";
import { User } from "../types/user";
import { fetchAPI } from "./helpers";

export const fetchUser = async () => fetchAPI<User>("/users/me");

export const createUser = async (input: UserEventData) => fetchAPI<User>(`/users`, { method: 'POST', body: JSON.stringify(input) })

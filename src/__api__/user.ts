import { User } from "../types/user";
import { fetchAPI } from "./helpers";

export const fetchUser = async () => fetchAPI<User>("/users/me");
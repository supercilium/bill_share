import { User } from "../types/user";
import { fetchWithToken } from "./helpers";

export const fetchUser = async () => fetchWithToken<User>("/users/me");
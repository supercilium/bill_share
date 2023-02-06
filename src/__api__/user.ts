import { User } from "../types/user";
import { fetchWithToken } from "./helpers";

export const fetchUser = async () => {
    const data = await fetchWithToken<User>("/users/me");

    return data;
};
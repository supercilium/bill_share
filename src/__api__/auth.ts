import { LoginInterface, User } from "../types/user";
import { fetchAPI } from "./helpers";

export const fetchRegister = async (input: LoginInterface) => {
    const data = await fetchAPI<User>(
        "/auth/local/register",
        { method: 'POST', body: JSON.stringify(input) }
    );

    return data;
};

export const fetchLogin = async (input: LoginInterface) => {
    const data = await fetchAPI<User>("/auth/local", { method: 'POST', body: JSON.stringify(input) });

    return data;
};

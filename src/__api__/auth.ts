import { LoginInterface, User } from "../types/user";
import { fetchAPI } from "./helpers";

export const fetchRegister = async (input: LoginInterface) => {
    const data = await fetchAPI<{ token: string }>(
        "/auth/local/register",
        { method: 'POST', body: JSON.stringify(input) }
    );

    return data;
};

export const fetchLogin = async (input: LoginInterface) => {
    const data = await fetchAPI<{ token: string }>("/auth/local", { method: 'POST', body: JSON.stringify(input) });

    return data;
};

export const fetchIsAuth = async (token?: string) => {
    const data = await fetchAPI<User>("/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
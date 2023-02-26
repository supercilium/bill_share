import { CreatePartyInterface, PartiesListDTO, PartyInterface } from "../types/party";
import { fetchAPI } from "./helpers";

interface RequestParams {
    [key: string]: string;
}

export const getParties = async (params: RequestParams) => {
    const query = new URLSearchParams(params)
    const data = await fetchAPI<PartiesListDTO>(`/parties?${query}`)
    return data;
}

export const getPartyById = async (id: string) => fetchAPI<PartyInterface>(`/parties/${id}`)

export const createParty = async (input: CreatePartyInterface) => fetchAPI<PartyInterface>(`/parties`, { method: 'POST', body: JSON.stringify(input) })

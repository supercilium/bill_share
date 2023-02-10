import { UserEventData } from "../types/events";
import { CreatePartyInterface, PartyInterface } from "../types/party";
import { User } from "../types/user";
import { fetchAPI } from "./helpers";

// export const getParties = async () => {
//   const data = await fetchAPI<PartyInterface[]>('/party')
//   return data;
// }

export const getPartyById = async (id: string) => fetchAPI<PartyInterface>(`/party/${id}`)

// export const putPartyById = async (id: string, input: Record<any, any>) => {
//   const data = await fetchAPI<PartyInterface>(`/party/${id}`, { method: 'PUT', body: JSON.stringify(input) })
//   return data;
// }

export const createParty = async (input: CreatePartyInterface) => fetchAPI<PartyInterface>(`/party`, { method: 'POST', body: JSON.stringify(input) })


export const createUser = async (input: UserEventData) => fetchAPI<User>(`/user`, { method: 'POST', body: JSON.stringify(input) })

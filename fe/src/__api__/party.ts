import { PartyInterface } from "../types/party";
import { fetchAPI } from "./helpers";

export const getParties = async () => {
  const data = await fetchAPI<PartyInterface[]>('/party')
  return data;
}

export const getPartyById = async (id: string) => {
  const data = await fetchAPI(`/party/${id}`)
  return data;
}

export const putPartyById = async (id: string, input: Record<any, any>) => {
  const data = await fetchAPI(`/party/${id}`, { method: 'PUT', body: JSON.stringify(input) })
  return data;
}

export const createParty = async (input: Record<any, any>) => {
  const data = await fetchAPI<PartyInterface>(`/party`, { method: 'POST', body: JSON.stringify(input) })
  return data;
}

export const createUser = async (input: Record<any, any>) => {
  const data = await fetchAPI<PartyInterface>(`/user`, { method: 'POST', body: JSON.stringify(input) })
  return data;
}

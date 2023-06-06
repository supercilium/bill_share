import {
  CreatePartyInterface,
  PartiesListDTO,
  PartyInterfaceDTO,
} from "../types/party";
import { fetchAPI } from "./helpers";

interface RequestParams {
  [key: string]: string;
}

export const getParties = async (params: RequestParams) => {
  const query = new URLSearchParams(params);
  const data = await fetchAPI<PartiesListDTO>(`/parties?${query}`);
  return data;
};

export const checkPartyConfirmed = async (params: RequestParams) => {
  const query = new URLSearchParams(params);
  const data = await fetchAPI<Response>(`/guests/check-confirmed?${query}`);
  return data;
};

export const getPartyById = async (id: string) =>
  fetchAPI<PartyInterfaceDTO>(`/parties/${id}`);

export const createParty = async (input: CreatePartyInterface) =>
  fetchAPI<PartyInterfaceDTO>(`/parties`, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const deleteParty = async (id: string) =>
  fetchAPI<void>(`/parties/${id}`, { method: "DELETE" });

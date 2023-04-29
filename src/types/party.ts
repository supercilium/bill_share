import { Item, ItemDTO } from "./item";
import { User } from "./user";

export interface PartyInterface {
  name: string;
  owner: User;
  id: string;
  discount?: number;
  isPercentage: boolean;
  users: Record<string, User>;
  items: Array<Item>;
}
export interface PartyInterfaceDTO {
  name: string;
  owner: User;
  id: string;
  discount?: number;
  isPercentage: boolean;
  users: Array<User>;
  items: Array<ItemDTO>;
}

export interface CreatePartyInterface {
  partyName: string;
  // userName: string;
  id: string;
}

export interface PartyListInterface {
  id: string;
  name: string;
  isOwner: boolean;
}
export interface PartiesListDTO {
  data: PartyListInterface[];
  amount: number;
}

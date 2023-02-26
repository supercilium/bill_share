import { Item } from "./item";
import { User } from "./user";

export interface PartyInterface {
  name: string;
  owner: User;
  id: string;
  discount?: number;
  isPercentage: boolean;
  users: Array<User>;
  items: Array<Item>;
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

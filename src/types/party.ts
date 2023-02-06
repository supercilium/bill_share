import { Item } from "./item";
import { User } from "./user";

export interface PartyInterface {
  name: string;
  owner: User;
  id: string;
  discount?: number;
  users: Array<User>;
  items: Array<Item>;
}

export interface CreatePartyInterface {
  partyName: string;
  // userName: string;
  id: string;
}
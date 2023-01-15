import { Item } from "./item";
import { User } from "./user";

export interface PartyInterface {
  name: string;
  owner: User;
  id: string;
  users: Array<User>;
  items: Array<Item>;
}

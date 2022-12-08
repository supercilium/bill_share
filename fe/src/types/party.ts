import { User } from "./user";

export interface PartyInterface {
  name: string;
  owner: User;
  id: string;
  users: Array<User>;
}

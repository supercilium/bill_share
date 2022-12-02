import { User } from "./user";

export interface PartyInterface {
  name: string;
  master: User;
  id: string;
  users: Array<User>;
}

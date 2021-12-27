import { UserInterface } from './user';

export interface Party {
  id: string;
  users: UserInterface[]
  masterUser: UserInterface;
  list: any[];
  start: string;
  end: string;
}

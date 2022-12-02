import { UserInterface } from './user';
import { ItemInterface } from './item';

export interface Party {
  id: string;
  name?: string;
  users: UserInterface[]
  masterUser: UserInterface;
  list: ItemInterface[];
  start: string;
  end: string;
}

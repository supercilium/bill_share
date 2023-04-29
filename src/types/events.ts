import { Item } from "./item";
import { PartyInterfaceDTO } from "./party";

export type WorkerActions = "connect" | "close" | "change state";

export type DiscountEvents = "update discount";

export type UserEvents = "add user" | "remove user";

export type ItemEvents = "add item" | "remove item" | "update item";

export type ItemUserEvents =
  | "add user item"
  | "remove user item"
  | "update user item";

export type PartyEvents =
  | UserEvents
  | ItemEvents
  | ItemUserEvents
  | DiscountEvents
  | WorkerActions;

export interface DiscountEventData {
  userId?: string;
  partyId: string;
  discount: number;
  isPercentage: boolean;
}

export interface UserEventData {
  id?: string;
  userId?: string;
  userName?: string;
  partyId: string;
  email?: string;
}

export interface ItemEventData extends Partial<Omit<Item, "id" | "users">> {
  userId: string;
  partyId: string;
  itemId?: string;
}

export interface ItemUserEventData {
  userId: string;
  partyId: string;
  itemId: string;
  value?: number;
}

export type EventDTO<Type extends PartyEvents, DTO> = DTO & {
  type: Type;
};

export type UserDTO = EventDTO<UserEvents, UserEventData>;
export type ItemDTO = EventDTO<ItemEvents, ItemEventData>;
export type ItemUserDTO = EventDTO<ItemUserEvents, ItemUserEventData>;
export type DiscountDTO = EventDTO<DiscountEvents, DiscountEventData>;
export type WorkerData = EventDTO<
  WorkerActions,
  { id?: string; state?: number }
>;

export type EventData =
  | WorkerData
  | UserDTO
  | ItemDTO
  | ItemUserDTO
  | DiscountDTO;

export interface EventResponseDTO {
  party: PartyInterfaceDTO;
  type: PartyEvents | "error";
  message?: string;
  eventData?: {
    itemName: string;
    userName: string;
  };
}

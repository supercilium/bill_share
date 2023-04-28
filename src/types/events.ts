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

export interface EventDataWithUser {
  currentUser: string;
  userId?: string;
  partyId: string;
}
export interface DiscountEventData extends EventDataWithUser {
  discount: number;
  isPercentage: boolean;
}

export interface UserEventData extends EventDataWithUser {
  id?: string;
  userName?: string;
  email?: string;
}

export interface ItemEventData
  extends Partial<Omit<Item, "id" | "users">>,
    EventDataWithUser {
  itemId?: string;
}

export interface ItemUserEventData extends EventDataWithUser {
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

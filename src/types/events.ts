import { Item } from "./item";

export type UserEvents = "add user" | "remove user";

export type ItemEvents = "add item" | "remove item" | "update item";

export type ItemUserEvents = "add user item" | "remove user item" | "update user item";

export type PartyEvents = UserEvents | ItemEvents | ItemUserEvents;

export interface UserEventData {
    userId?: string;
    userName?: string;
    partyId: string;
}

export interface ItemEventData extends Partial<Omit<Item, 'id' | 'users'>> {
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
}

export type UserDTO = EventDTO<UserEvents, UserEventData>
export type ItemDTO = EventDTO<ItemEvents, ItemEventData>
export type ItemUserDTO = EventDTO<ItemUserEvents, ItemUserEventData>

export type EventData = UserDTO | ItemDTO | ItemUserDTO
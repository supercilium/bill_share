import { Item } from "../types/item";

export const getItemParticipants = (item: Item) => item.users.filter((user) => user.value > 0);

export const getItemTotal = (item: Item) => (item.price - item.price * (item.discount || 0));

export const getPartyTotal = (items: Item[]) => items.reduce((acc, item) => acc + getItemTotal(item), 0)

export const getTotalDiscount = (items: Item[]) => items.reduce(
    (acc, item) => acc + item.price * (item.discount || 0),
    0
)

export const getPartyUserTotal = (items: Item[], id: string) => items
    .reduce((acc, item) => {
        const participants = getItemParticipants(item);
        if (participants.some((user) => user.id === id)) {
            return acc + getItemTotal(item) / participants.length;
        }
        return acc;
    }, 0)
    .toFixed(2)

export const splitItems = (items: Item[], userId: string): [Array<
    Item & { originalIndex: number; originalUserIndex: number; total: number }
>, Array<Item & { originalIndex: number }>] => {
    const userItems: Array<
        Item & { originalIndex: number; originalUserIndex: number; total: number }
    > = [];
    const restItems: Array<Item & { originalIndex: number }> = [];

    items.forEach((item, i) => {
        const userIndex = item.users.findIndex(({ id }) => userId === id);
        if (userIndex >= 0) {
            const participants = getItemParticipants(item);
            userItems.push({
                ...item,
                originalIndex: i,
                originalUserIndex: userIndex,
                total: getItemTotal(item) / participants.length,
            });
        } else {
            restItems.push({ ...item, originalIndex: i });
        }
    });

    return [userItems, restItems]
}
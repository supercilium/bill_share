import { Item } from "../types/item";

export const getItemParticipants = (item: Item) => item.equally ? item.users : item.users.filter((user) => user.value > 0);

export const getItemTotal = (item: Item, amount: number) => (item.price - item.price * (item.discount || 0)) * (amount || 0);

export const getPartyTotal = (items: Item[]) => items.reduce((acc, item) => acc + getItemTotal(item, item.amount), 0)

export const getTotalDiscount = (items: Item[]) => items.reduce(
    (acc, item) => acc + item.price * (item.discount || 0),
    0
)

export const getPartyUserTotal = (items: Item[], id: string) => items
    .reduce((acc, item) => {
        const participants = getItemParticipants(item);
        const userIndex = participants.findIndex((user) => user.id === id);
        if (userIndex >= 0) {
            return acc + (item.equally ? getItemTotal(item, item.amount) / participants.length : getItemTotal(item, item.users[userIndex].value));
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
                total: item.equally ? getItemTotal(item, item.amount) / participants.length : getItemTotal(item, item.users[userIndex].value),
            });
        } else {
            restItems.push({ ...item, originalIndex: i });
        }
    });

    return [userItems, restItems]
}
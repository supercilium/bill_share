import { Item } from "../types/item";

export const getItemParticipants = (item: Item) =>
  item.equally
    ? item.users.filter((user) => user.value >= 0)
    : item.users.filter((user) => user.value > 0);

export const getItemBaseTotal = (item: Item, amount: number) =>
  item.price * (amount || 0);

export const getItemDiscount = (item: Item, amount: number) =>
  0.01 * (item.discount || 0) * (amount || 0) * item.price;

export const getItemTotal = (item: Item, amount: number) =>
  getItemBaseTotal(item, amount) - getItemDiscount(item, amount);

export const getTotalDiscount = (items: Item[]) =>
  items.reduce(
    (acc, item) =>
      acc + item.price * 0.01 * (item.discount || 0) * (item.amount || 0),
    0
  );

export const getBaseTotal = (items: Item[]) =>
  items.reduce((acc, item) => acc + getItemBaseTotal(item, item.amount), 0);

export const getPartyTotal = (items: Item[]) =>
  getBaseTotal(items) - getTotalDiscount(items);

export const getPartyUserBaseTotal = (items: Item[], id: string) =>
  items.reduce((acc, item) => {
    const participants = getItemParticipants(item);
    const userIndex = participants.findIndex((user) => user.id === id);
    if (userIndex >= 0) {
      return (
        acc +
        (item.equally
          ? getItemBaseTotal(item, item.amount) / participants.length
          : getItemBaseTotal(item, item.users[userIndex].value))
      );
    }
    return acc;
  }, 0);

export const getPartyUserDiscount = (items: Item[], id: string) =>
  items.reduce((acc, item) => {
    const participants = getItemParticipants(item);
    const userIndex = participants.findIndex((user) => user.id === id);
    if (userIndex >= 0) {
      return (
        acc +
        (item.equally
          ? getItemDiscount(item, item.amount) / participants.length
          : getItemDiscount(item, item.users[userIndex].value))
      );
    }
    return acc;
  }, 0);

export const getPartyUserTotal = (items: Item[], id: string) =>
  getPartyUserBaseTotal(items, id) - getPartyUserDiscount(items, id);

export const splitItems = (
  items: Item[],
  userId: string
): [
  Array<
    Item & {
      originalIndex: number;
      originalUserIndex: number;
      total: number;
      participants: number;
    }
  >,
  Array<Item & { originalIndex: number; isMuted?: boolean }>
] => {
  const userItems: Array<
    Item & {
      originalIndex: number;
      originalUserIndex: number;
      total: number;
      participants: number;
    }
  > = [];
  const restItems: Array<Item & { originalIndex: number; isMuted?: boolean }> =
    [];

  items.forEach((item, i) => {
    const userIndex = item.users.findIndex(({ id }) => userId === id);
    if (userIndex >= 0 && (item.equally || item.users[userIndex].value)) {
      const participants = getItemParticipants(item);
      userItems.push({
        ...item,
        participants: participants.length,
        originalIndex: i,
        originalUserIndex: userIndex,
        total: item.equally
          ? getItemTotal(item, item.amount) / participants.length
          : getItemTotal(item, item.users[userIndex].value),
      });
      if (!item.equally && item.users[userIndex].value < item.amount) {
        restItems.push({ ...item, originalIndex: i, isMuted: true });
      }
    } else {
      restItems.push({ ...item, originalIndex: i });
    }
  });

  return [userItems, restItems];
};

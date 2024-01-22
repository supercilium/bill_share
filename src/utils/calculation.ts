import { Item } from "../types/item";

export const getItemParticipants = (item: Item) =>
  item.equally
    ? Object.values(item.users).filter((user) => user.checked)
    : Object.values(item.users).filter((user) => (user?.value ?? 0) > 0);

export const getItemBaseTotal = (item: Item, amount?: number) =>
  item.price * (amount ?? 0);

export const getItemDiscount = (item: Item, amount?: number) =>
  0.01 * (item.discount ?? 0) * (amount ?? 0) * item.price;

export const getItemTotal = (item: Item, amount?: number) =>
  getItemBaseTotal(item, amount) - getItemDiscount(item, amount);

export const getTotalDiscount = (items: Item[]) =>
  items.reduce(
    (acc, item) =>
      acc + item.price * 0.01 * (item.discount ?? 0) * (item.amount || 0),
    0
  );

export const getBaseTotal = (items: Item[]) =>
  items.reduce((acc, item) => acc + getItemBaseTotal(item, item.amount), 0);

export const getPartyTotal = (items: Item[]) =>
  getBaseTotal(items) - getTotalDiscount(items);

export const getPartyUserBaseTotal = (items: Item[], id: string) =>
  items.reduce((acc, item) => {
    const participants = getItemParticipants(item);
    if (!item.users[id]?.value && !item.users[id]?.checked) {
      return acc;
    }
    return (
      acc +
      (item.equally
        ? getItemBaseTotal(item, item.amount) / participants.length
        : getItemBaseTotal(item, item.users[id]?.value))
    );
  }, 0);

export const getPartyUserDiscount = (items: Item[], id: string) =>
  items.reduce((acc, item) => {
    const participants = getItemParticipants(item);
    if (!item.users[id]?.value && !item.users[id]?.checked) {
      return acc;
    }

    return (
      acc +
      (item.equally
        ? getItemDiscount(item, item.amount) / participants.length
        : getItemDiscount(item, item.users[id].value))
    );
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
      total: number;
      participants: number;
    }
  >,
  Array<Item & { originalIndex: number; isMuted?: boolean }>
] => {
  const userItems: Array<
    Item & {
      originalIndex: number;
      total: number;
      participants: number;
    }
  > = [];
  const restItems: Array<Item & { originalIndex: number; isMuted?: boolean }> =
    [];

  items.forEach((item, i) => {
    if (
      item.users[userId] &&
      (item.equally
        ? item.users[userId].checked
        : (item.users[userId].value ?? 0) > 0)
    ) {
      const participants = getItemParticipants(item);
      userItems.push({
        ...item,
        participants: participants.length,
        originalIndex: i,
        total: item.equally
          ? getItemTotal(item, item.amount) / participants.length
          : getItemTotal(item, item.users[userId].value),
      });
      if (!item.equally && (item.users[userId].value ?? 0) < item.amount) {
        restItems.push({ ...item, originalIndex: i, isMuted: true });
      }
    } else {
      restItems.push({ ...item, originalIndex: i });
    }
  });

  return [userItems, restItems];
};

/**
 * Returns absolute amount of discount
 */
export const getFullDiscount = (
  baseTotal: number,
  discount: number,
  isPercentage: boolean
) => {
  if (isPercentage) {
    return baseTotal * (discount ?? 0) * 0.01;
  }
  return discount;
};

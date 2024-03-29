import { PartyInterface, PartyInterfaceDTO } from "../types/party";

export const sortPartyUsers = (
  party: PartyInterfaceDTO,
  currentUser: string
): PartyInterface => {
  const usersMap = mapUsers(party.users, currentUser);

  const items = party.items.map((item) => ({
    ...item,
    users: mapUsers(item.users, currentUser, party.users),
  }));
  const data = { ...party, items, users: usersMap };
  return data as PartyInterface;
};

const mapUsers = (
  users: Array<{ id: string; [key: string]: any | undefined }>,
  user: string,
  partyUsers?: Array<{ id: string; [key: string]: any | undefined }>
) => {
  const currentUserIndex = users.findIndex(({ id }) => id === user);
  let currentUser = { id: user };
  if (currentUserIndex > -1) {
    [currentUser] = users.splice(currentUserIndex, 1);
  }

  const arr = new Set([
    ...users.map((user) => user.id),
    ...(partyUsers?.map((user) => user.id) ?? []),
  ]);
  const res = Array.from(arr).reduce((acc, id) => {
    acc[id] = users.find((elem) => elem.id === id) ?? { id };
    return acc;
  }, {} as Record<string, { id: string; [key: string]: any | undefined }>);
  return { [user]: currentUser, ...res };
};

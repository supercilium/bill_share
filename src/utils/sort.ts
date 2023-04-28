import { PartyInterface, PartyInterfaceDTO } from "../types/party";

export const sortPartyUsers = (
  party: PartyInterfaceDTO,
  currentUser: string
): PartyInterface => {
  const usersMap = mapUsers(party.users, currentUser);

  const items = party.items.map((item) => ({
    ...item,
    users: mapUsers(item.users, currentUser),
  }));
  const data = { ...party, items, users: usersMap };
  return data as PartyInterface;
};

const mapUsers = (
  users: Array<{ id: string; [key: string]: any | undefined }>,
  user: string
) => {
  const [currentUser] = users.splice(
    users.findIndex(({ id }) => id === user),
    1
  );
  const res = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<string, { id: string; [key: string]: any | undefined }>);
  return { [user]: currentUser, ...res };
};

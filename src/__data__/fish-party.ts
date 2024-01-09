import { PartyInterface } from "../types/party";

export const FISH_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "PARTY_NAME_OWNER",
  },
  name: "FISH_PARTY_NAME",
  discount: 0.0,
  id: "fish-party-id",
  isPercentage: false,
  items: [
    {
      name: "FISH_PARTY_ITEM_1",
      id: "beer-id",
      price: 100.0,
      amount: 4,
      equally: true,
      discount: 0.0,
      users: {
        "salmon-id": {
          id: "salmon-id",
          value: 1,
        },
        "your-id": {
          id: "your-id",
          value: 0,
        },
        "bonito-id": {
          id: "bonito-id",
          value: 1,
        },
      },
    },
    {
      name: "FISH_PARTY_ITEM_2",
      id: "chips-id",
      price: 16.0,
      amount: 3,
      equally: true,
      discount: 0.0,
      users: {
        "salmon-id": {
          id: "salmon-id",
          value: 1,
        },
        "your-id": {
          id: "your-id",
          value: 0,
        },
        "bonito-id": {
          id: "bonito-id",
          value: 1,
        },
      },
    },
    {
      name: "FISH_PARTY_ITEM_3",
      id: "fish-id",
      price: 45.0,
      amount: 2,
      equally: true,
      discount: 0.0,
      users: {
        "your-id": {
          id: "your-id",
          value: 1,
        },
      },
    },
  ],
  users: {
    "your-id": {
      id: "your-id",
      name: "PARTY_NAME_OWNER",
    },
    "bonito-id": {
      id: "bonito-id",
      name: "FISH_PARTY_NAME_1",
    },
    "salmon-id": {
      id: "salmon-id",
      name: "FISH_PARTY_NAME_2",
    },
  },
};

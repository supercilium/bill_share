import { PartyInterface } from "../types/party";

export const FISH_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "You",
  },
  name: "Just party",
  discount: 0.0,
  id: "fish-party-id",
  isPercentage: false,
  items: [
    {
      name: "Beer",
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
      name: "Chips",
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
      name: "Fish",
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
      name: "You",
    },
    "bonito-id": {
      id: "bonito-id",
      name: "Bonito",
    },
    "salmon-id": {
      id: "salmon-id",
      name: "Salmon",
    },
  },
};

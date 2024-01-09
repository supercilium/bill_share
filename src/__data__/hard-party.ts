import { PartyInterface } from "../types/party";

export const HARD_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "PARTY_NAME_OWNER",
  },
  name: "HARD_PARTY_NAME",
  discount: 0.0,
  id: "hard-party-id",
  isPercentage: true,
  items: [
    {
      name: "HARD_PARTY_ITEM_1",
      id: "whiskey-id",
      price: 250.0,
      amount: 10,
      equally: true,
      discount: 10.0,
      users: {
        "horsefish-id": {
          id: "horsefish-id",
          value: 1,
        },
        "herring-id": {
          id: "herring-id",
          value: 1,
        },
      },
    },
    {
      name: "HARD_PARTY_ITEM_2",
      id: "rum-id",
      price: 160.0,
      amount: 3,
      equally: false,
      discount: 0.0,
      users: {
        "your-id": {
          id: "your-id",
          value: 1,
        },
        "herring-id": {
          id: "herring-id",
          value: 2,
        },
      },
    },
    {
      name: "HARD_PARTY_ITEM_3",
      id: "Vodka-id",
      price: 180.0,
      amount: 1,
      equally: false,
      discount: 0.0,
      users: {
        "your-id": {
          id: "your-id",
          value: 1,
        },
      },
    },
    {
      name: "HARD_PARTY_ITEM_4",
      id: "cola-id",
      price: 15.0,
      amount: 5,
      equally: false,
      discount: 5.0,
      users: {
        "your-id": {
          id: "your-id",
          value: 1,
        },
        "horsefish-id": {
          id: "horsefish-id",
          value: 2,
        },
        "herring-id": {
          id: "herring-id",
          value: 2,
        },
      },
    },
  ],
  users: {
    "your-id": {
      id: "your-id",
      name: "PARTY_NAME_OWNER",
    },
    "horsefish-id": {
      id: "horsefish-id",
      name: "HARD_PARTY_NAME_1",
    },
    "herring-id": {
      id: "herring-id",
      name: "HARD_PARTY_NAME_2",
    },
  },
};

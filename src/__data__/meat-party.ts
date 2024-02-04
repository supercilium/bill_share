import { PartyInterface } from "../types/party";

export const MEAT_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "PARTY_NAME_OWNER",
  },
  name: "MEAT_PARTY_NAME",
  discount: 100.0,
  id: "meat-party-id",
  isPercentage: false,
  items: [
    {
      name: "MEAT_PARTY_ITEM_1",
      id: "roast-beef-id",
      price: 220.0,
      amount: 2,
      equally: true,
      discount: 0.0,
      users: {
        "devil-ray-id": {
          id: "devil-ray-id",
          value: 1,
          checked: true,
        },
        "firefish-id": {
          id: "firefish-id",
          value: 1,
          checked: true,
        },
      },
    },
    {
      name: "MEAT_PARTY_ITEM_2",
      id: "chicken-wings-salad",
      price: 160.0,
      amount: 1,
      equally: true,
      discount: 0.0,
      users: {
        "your-id": {
          id: "your-id",
          value: 1,
          checked: true,
        },
        "devil-ray-id": {
          id: "devil-ray-id",
          value: 2,
          checked: true,
        },
        "firefish-id": {
          id: "firefish-id",
          value: 2,
          checked: true,
        },
      },
    },
    {
      name: "MEAT_PARTY_ITEM_3",
      id: "hamburger-id",
      price: 80.0,
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
      name: "MEAT_PARTY_ITEM_4",
      id: "water-id",
      price: 5.0,
      amount: 5,
      equally: false,
      discount: 0.0,
      users: {
        "your-id": {
          id: "your-id",
          value: 1,
        },
        "devil-ray-id": {
          id: "devil-ray-id",
          value: 2,
        },
        "firefish-id": {
          id: "firefish-id",
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
    "devil-ray-id": {
      id: "devil-ray-id",
      name: "MEAT_PARTY_NAME_1",
    },
    "firefish-id": {
      id: "firefish-id",
      name: "MEAT_PARTY_NAME_2",
    },
  },
};

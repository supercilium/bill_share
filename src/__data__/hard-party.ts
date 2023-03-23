import { PartyInterface } from "../types/party";

export const HARD_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "You",
  },
  name: "Hard party",
  discount: 0.0,
  id: "hard-party-id",
  isPercentage: true,
  items: [
    {
      name: "Whiskey",
      id: "whiskey-id",
      price: 250.0,
      amount: 10,
      equally: true,
      discount: 10.0,
      users: [
        {
          id: "horsefish-id",
          value: 1,
        },
        {
          id: "herring-id",
          value: 1,
        },
      ],
    },
    {
      name: "Rum",
      id: "rum-id",
      price: 160.0,
      amount: 3,
      equally: false,
      discount: 0.0,
      users: [
        {
          id: "your-id",
          value: 1,
        },
        {
          id: "herring-id",
          value: 2,
        },
      ],
    },
    {
      name: "Vodka",
      id: "Vodka-id",
      price: 180.0,
      amount: 1,
      equally: false,
      discount: 0.0,
      users: [
        {
          id: "your-id",
          value: 1,
        },
      ],
    },
    {
      name: "Cola",
      id: "cola-id",
      price: 15.0,
      amount: 5,
      equally: false,
      discount: 5.0,
      users: [
        {
          id: "your-id",
          value: 1,
        },
        {
          id: "horsefish-id",
          value: 2,
        },
        {
          id: "herring-id",
          value: 2,
        },
      ],
    },
  ],
  users: [
    {
      id: "your-id",
      name: "You",
    },
    {
      id: "horsefish-id",
      name: "Horsefish",
    },
    {
      id: "herring-id",
      name: "Herring",
    },
  ],
};

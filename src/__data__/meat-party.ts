import { PartyInterface } from "../types/party";

export const MEAT_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "You",
  },
  name: "Meat party",
  discount: 100.0,
  id: "meat-party-id",
  isPercentage: false,
  items: [
    {
      name: "Roast beef",
      id: "roast-beef-id",
      price: 220.0,
      amount: 2,
      equally: true,
      discount: 0.0,
      users: [
        {
          id: "devil-ray-id",
          value: 1,
        },
        {
          id: "firefish-id",
          value: 1,
        },
      ],
    },
    {
      name: "Chicken wings",
      id: "chicken-wings-salad",
      price: 160.0,
      amount: 1,
      equally: true,
      discount: 0.0,
      users: [
        {
          id: "your-id",
          value: 1,
        },
        {
          id: "devil-ray-id",
          value: 2,
        },
        {
          id: "firefish-id",
          value: 2,
        },
      ],
    },
    {
      name: "Hamburger",
      id: "hamburger-id",
      price: 80.0,
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
      name: "Sparkling water",
      id: "water-id",
      price: 5.0,
      amount: 5,
      equally: false,
      discount: 0.0,
      users: [
        {
          id: "your-id",
          value: 1,
        },
        {
          id: "devil-ray-id",
          value: 2,
        },
        {
          id: "firefish-id",
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
      id: "devil-ray-id",
      name: "Devil ray",
    },
    {
      id: "firefish-id",
      name: "Firefish",
    },
  ],
};

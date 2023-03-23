import { PartyInterface } from "../types/party";

export const COCKTAIL_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "You",
  },
  name: "Cocktail party",
  discount: 10.0,
  id: "cocktail-party-id",
  isPercentage: true,
  items: [
    {
      name: "Whiskey sour",
      id: "whiskey-sour-id",
      price: 220.0,
      amount: 10,
      equally: true,
      discount: 0.0,
      users: [
        {
          id: "frogfish-id",
          value: 1,
        },
        {
          id: "goatfish-id",
          value: 1,
        },
      ],
    },
    {
      name: "Long Island Ice Tea",
      id: "long-island-ice-tea-id",
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
          id: "goatfish-id",
          value: 2,
        },
      ],
    },
    {
      name: "Bloody mary",
      id: "hamburger-id",
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
          id: "frogfish-id",
          value: 2,
        },
        {
          id: "goatfish-id",
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
      id: "frogfish-id",
      name: "Frogfish",
    },
    {
      id: "goatfish-id",
      name: "Goatfish",
    },
  ],
};

import { PartyInterface } from "../types/party";

export const SALAD_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "You",
  },
  name: "Salad party",
  discount: 0.0,
  id: "salad-party-id",
  isPercentage: false,
  items: [
    {
      name: "Caesar salad",
      id: "caesar-salad-id",
      price: 120.0,
      amount: 2,
      equally: false,
      discount: 0.0,
      users: {
        "dory-id": {
          id: "dory-id",
          value: 1,
        },
        "dogfish-id": {
          id: "dogfish-id",
          value: 1,
        },
      },
    },
    {
      name: "Crunchy Asian salad",
      id: "crunchy-asian-salad",
      price: 160.0,
      amount: 1,
      equally: false,
      discount: 0.0,
      users: {
        "dory-id": {
          id: "dory-id",
          value: 1,
        },
      },
    },
    {
      name: "Green salad",
      id: "green-salad-id",
      price: 45.0,
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
      name: "Green tea",
      id: "green-tea-id",
      price: 5.0,
      amount: 5,
      equally: false,
      discount: 0.0,
      users: {
        "your-id": {
          id: "your-id",
          value: 1,
        },
        "dory-id": {
          id: "dory-id",
          value: 2,
        },
        "dogfish-id": {
          id: "dogfish-id",
          value: 2,
        },
      },
    },
  ],
  users: {
    "your-id": {
      id: "your-id",
      name: "You",
    },
    "dory-id": {
      id: "dory-id",
      name: "Dory",
    },
    "dogfish-id": {
      id: "dogfish-id",
      name: "Dogfish",
    },
  },
};

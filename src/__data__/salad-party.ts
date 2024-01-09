import { PartyInterface } from "../types/party";

export const SALAD_PARTY: PartyInterface = {
  owner: {
    id: "your-id",
    name: "PARTY_NAME_OWNER",
  },
  name: "SALAD_PARTY_NAME",
  discount: 0.0,
  id: "salad-party-id",
  isPercentage: false,
  items: [
    {
      name: "SALAD_PARTY_ITEM_1",
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
      name: "SALAD_PARTY_ITEM_2",
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
      name: "SALAD_PARTY_ITEM_3",
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
      name: "SALAD_PARTY_ITEM_4",
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
      name: "PARTY_NAME_OWNER",
    },
    "dory-id": {
      id: "dory-id",
      name: "SALAD_PARTY_NAME_1",
    },
    "dogfish-id": {
      id: "dogfish-id",
      name: "SALAD_PARTY_NAME_2",
    },
  },
};

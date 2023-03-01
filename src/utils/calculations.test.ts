import {
  getBaseTotal,
  getItemBaseTotal,
  getItemDiscount,
  getItemParticipants,
  getItemTotal,
  getPartyTotal,
  getPartyUserBaseTotal,
  getPartyUserDiscount,
  getPartyUserTotal,
  getTotalDiscount,
  splitItems,
} from "./calculation";

const PARTY = {
  owner: {
    name: "Mary",
    id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
  },
  name: "колбасов",
  discount: 0,
  id: "5c140418-3f42-4692-8065-4127f1095b77",
  isPercentage: false,
  items: [
    {
      amount: 2,
      price: 100,
      equally: false,
      name: "pivo",
      discount: 10,
      id: "9b54327c-fbbf-4b0b-aa0e-45aabe5271ac",
      createdOn: "2023-02-21T19:28:20.976568",
      users: [
        {
          name: "Клатчи и вечерние сумки",
          id: "4c086579-760b-4593-96bc-04c485adcb17",
          value: 1,
          email: "alkash@top.one",
        },
        {
          name: "Mary",
          id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
          value: 1,
          email: "marusel.12@gmail.com",
        },
      ],
    },
  ],
  users: [
    {
      name: "Клатч",
      id: "4c086579-760b-4593-96bc-04c485adcb17",
      email: "a@t.o",
    },
    {
      name: "Mary",
      id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
      email: "m@g.com",
    },
  ],
};

describe("getItemDiscount", () => {
  it("should return discount", () => {
    expect(getItemDiscount(PARTY.items[0], 1)).toBe(10);
  });
  it("should return full discount", () => {
    expect(getItemDiscount(PARTY.items[0], 2)).toBe(20);
  });
});

describe("getItemTotal", () => {
  it("should return sum w/o discount for part of items", () => {
    expect(getItemTotal(PARTY.items[0], 1)).toBe(90);
  });
  it("should return full sum w/o discount", () => {
    expect(getItemTotal(PARTY.items[0], 2)).toBe(180);
  });
});

describe("getItemBaseTotal", () => {
  it("should return sum with discount for part of items", () => {
    expect(getItemBaseTotal(PARTY.items[0], 1)).toBe(100);
  });
  it("should return full sum with discount", () => {
    expect(getItemBaseTotal(PARTY.items[0], 2)).toBe(200);
  });
});

describe("getTotalDiscount", () => {
  it("should return sum with discount for part of items", () => {
    expect(getTotalDiscount(PARTY.items)).toBe(20);
  });
});

describe("getItemParticipants", () => {
  it("should return two participants", () => {
    expect(getItemParticipants(PARTY.items[0])).toHaveLength(2);
  });
  const item = {
    ...PARTY.items[0],
    users: [
      { ...PARTY.items[0].users[0], value: 2 },
      { ...PARTY.items[0].users[1], value: 0 },
    ],
    equally: true,
  };
  it("should return 1 participant", () => {
    expect(getItemParticipants(item)).toHaveLength(2);
  });
  it("should return 2 participants", () => {
    expect(getItemParticipants({ ...item, equally: false })).toHaveLength(1);
  });
});

describe("getBaseTotal", () => {
  it("should return base price", () => {
    expect(getBaseTotal(PARTY.items)).toBe(200);
  });
});

describe("getPartyTotal", () => {
  it("should return total price", () => {
    expect(getPartyTotal(PARTY.items)).toBe(180);
  });
});

describe("getPartyUserBaseTotal", () => {
  it("should return base price for user", () => {
    expect(getPartyUserBaseTotal(PARTY.items, PARTY.users[0].id)).toBe(100);
  });
});

describe("getPartyUserDiscount", () => {
  it("should return discount for user", () => {
    expect(getPartyUserDiscount(PARTY.items, PARTY.users[0].id)).toBe(10);
  });
  it("should return discount for user who drunk all item", () => {
    const items = [
      {
        ...PARTY.items[0],
        users: [
          { ...PARTY.items[0].users[0], value: 2 },
          { ...PARTY.items[0].users[1], value: 0 },
        ],
      },
    ];
    expect(getPartyUserDiscount(items, PARTY.users[0].id)).toBe(20);
    expect(getPartyUserDiscount(items, PARTY.users[1].id)).toBe(0);
  });
  it("should ignore values if item is shared", () => {
    const items = [
      {
        ...PARTY.items[0],
        users: [
          { ...PARTY.items[0].users[0], value: 2 },
          { ...PARTY.items[0].users[1], value: 0 },
        ],
        equally: true,
      },
    ];
    expect(getPartyUserDiscount(items, PARTY.users[0].id)).toBe(10);
    expect(getPartyUserDiscount(items, PARTY.users[1].id)).toBe(10);
  });
});

describe("getPartyUserTotal", () => {
  it("should return total sum for user", () => {
    expect(getPartyUserTotal(PARTY.items, PARTY.users[0].id)).toBe(90);
  });
});

const items = [
  {
    amount: 1,
    price: 1,
    equally: false,
    name: "фыва",
    discount: 0,
    id: "bd2cd2ae-8e48-4709-9c3b-5f5acfb58c0a",
    createdOn: "2023-02-26T09:25:39.635214",
    users: [
      {
        name: "Pakhomova Mary",
        id: "4c086579-760b-4593-96bc-04c485adcb17",
        value: 0,
        email: "marusel.12@gmail.com",
      },
    ],
  },
  {
    amount: 2,
    price: 1,
    equally: false,
    name: "фыва",
    discount: 0,
    id: "id2",
    createdOn: "2023-02-26T09:25:39.635214",
    users: [
      {
        name: "Pakhomova Mary",
        id: "4c086579-760b-4593-96bc-04c485adcb17",
        value: 1,
        email: "marusel.12@gmail.com",
      },
      {
        name: "Mary",
        id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
        value: 1,
        email: "marusel.12@gmail.com",
      },
    ],
  },
  {
    amount: 1,
    price: 0,
    equally: false,
    name: "dsfsdf",
    discount: 0,
    id: "9b3b7589-5a0c-4e4f-a8f0-b9d818b5b15c",
    createdOn: "2023-03-01T20:20:21.473535",
    users: [
      {
        name: "Pakhomova Mary",
        id: "4c086579-760b-4593-96bc-04c485adcb17",
        value: 1,
        email: "marusel.12@gmail.com",
      },
    ],
  },
  {
    amount: 1,
    price: 0,
    equally: true,
    name: "dsfsdf",
    discount: 0,
    id: "id1",
    createdOn: "2023-03-01T20:20:21.473535",
    users: [
      {
        name: "Pakhomova Mary",
        id: "4c086579-760b-4593-96bc-04c485adcb17",
        value: 0,
        email: "marusel.12@gmail.com",
      },
    ],
  },
];

describe("splitItems", () => {
  it("should return users` items", () => {
    expect(splitItems(items, "4c086579-760b-4593-96bc-04c485adcb17")).toEqual([
      [
        {
          amount: 2,
          createdOn: "2023-02-26T09:25:39.635214",
          discount: 0,
          equally: false,
          id: "id2",
          name: "фыва",
          originalIndex: 1,
          originalUserIndex: 0,
          participants: 2,
          price: 1,
          total: 1,
          users: [
            {
              email: "marusel.12@gmail.com",
              id: "4c086579-760b-4593-96bc-04c485adcb17",
              name: "Pakhomova Mary",
              value: 1,
            },
            {
              email: "marusel.12@gmail.com",
              id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
              name: "Mary",
              value: 1,
            },
          ],
        },
        {
          amount: 1,
          createdOn: "2023-03-01T20:20:21.473535",
          discount: 0,
          equally: false,
          id: "9b3b7589-5a0c-4e4f-a8f0-b9d818b5b15c",
          name: "dsfsdf",
          originalIndex: 2,
          originalUserIndex: 0,
          participants: 1,
          price: 0,
          total: 0,
          users: [
            {
              email: "marusel.12@gmail.com",
              id: "4c086579-760b-4593-96bc-04c485adcb17",
              name: "Pakhomova Mary",
              value: 1,
            },
          ],
        },
        {
          amount: 1,
          createdOn: "2023-03-01T20:20:21.473535",
          discount: 0,
          equally: true,
          id: "id1",
          name: "dsfsdf",
          originalIndex: 3,
          originalUserIndex: 0,
          participants: 1,
          price: 0,
          total: 0,
          users: [
            {
              email: "marusel.12@gmail.com",
              id: "4c086579-760b-4593-96bc-04c485adcb17",
              name: "Pakhomova Mary",
              value: 0,
            },
          ],
        },
      ],
      [
        {
          amount: 1,
          createdOn: "2023-02-26T09:25:39.635214",
          discount: 0,
          equally: false,
          id: "bd2cd2ae-8e48-4709-9c3b-5f5acfb58c0a",
          name: "фыва",
          originalIndex: 0,
          price: 1,
          users: [
            {
              email: "marusel.12@gmail.com",
              id: "4c086579-760b-4593-96bc-04c485adcb17",
              name: "Pakhomova Mary",
              value: 0,
            },
          ],
        },
        {
          amount: 2,
          createdOn: "2023-02-26T09:25:39.635214",
          discount: 0,
          equally: false,
          id: "id2",
          isMuted: true,
          name: "фыва",
          originalIndex: 1,
          price: 1,
          users: [
            {
              email: "marusel.12@gmail.com",
              id: "4c086579-760b-4593-96bc-04c485adcb17",
              name: "Pakhomova Mary",
              value: 1,
            },
            {
              email: "marusel.12@gmail.com",
              id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
              name: "Mary",
              value: 1,
            },
          ],
        },
      ],
    ]);
  });
});

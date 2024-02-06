import { Item } from "../types/item";
import {
  getBaseTotal,
  getFullDiscount,
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

const buggyParty = {
  discount: 0,
  id: "3d983b5e-d287-49fe-bc37-e8f5bbd2711f",
  isPercentage: true,
  items: [
    {
      amount: 1,
      createdOn: "2023-12-15T19:02:11.229060",
      discount: 0,
      equally: true,
      id: "eff048d0-424d-476a-a6ef-c6959ac7e3d0",
      name: "kartoha",
      price: 60,
      users: {
        "044b5e8a-0805-4728-a728-dba35c0c6458": {
          id: "044b5e8a-0805-4728-a728-dba35c0c6458",
          name: "kljlj",
          value: 0,
          checked: true,
        },
        "307d2524-bfb3-4192-bc60-62e460ebf0bb": {
          id: "307d2524-bfb3-4192-bc60-62e460ebf0bb",
        },
        "de1d5da9-dcad-4cab-ae42-cd28d93be8f5": {
          id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5",
          name: "marusel",
          value: 0,
          checked: true,
        },
      },
    },
    {
      amount: 3,
      createdOn: "2023-12-15T20:39:51.214996",
      discount: 0,
      equally: true,
      id: "6baf97dc-7280-4ddf-b5f1-cce47e50b77c",
      name: "nn",
      price: 40,
      users: {
        "044b5e8a-0805-4728-a728-dba35c0c6458": {
          id: "044b5e8a-0805-4728-a728-dba35c0c6458",
        },
        "307d2524-bfb3-4192-bc60-62e460ebf0bb": {
          id: "307d2524-bfb3-4192-bc60-62e460ebf0bb",
        },
        "de1d5da9-dcad-4cab-ae42-cd28d93be8f5": {
          id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5",
        },
      },
    },
  ],
  name: "party",
  owner: {
    id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5",
    name: "marusel",
  },
  users: {
    "044b5e8a-0805-4728-a728-dba35c0c6458": {
      id: "044b5e8a-0805-4728-a728-dba35c0c6458",
      name: "kljlj",
    },
    "307d2524-bfb3-4192-bc60-62e460ebf0bb": {
      id: "307d2524-bfb3-4192-bc60-62e460ebf0bb",
      name: "kljljh",
    },
    "de1d5da9-dcad-4cab-ae42-cd28d93be8f5": {
      id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5",
      name: "marusel",
    },
  },
};

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
      users: {
        "4c086579-760b-4593-96bc-04c485adcb17": {
          name: "Клатчи и вечерние сумки",
          id: "4c086579-760b-4593-96bc-04c485adcb17",
          value: 1,
          email: "alkash@top.one",
        },
        "3d17f607-5e69-4794-9c20-9a65a09c4c4b": {
          name: "Mary",
          id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
          value: 1,
          email: "mail@mail.com",
        },
      },
    },
  ],
  users: {
    "4c086579-760b-4593-96bc-04c485adcb17": {
      name: "Клатч",
      id: "4c086579-760b-4593-96bc-04c485adcb17",
      email: "a@t.o",
    },
    "3d17f607-5e69-4794-9c20-9a65a09c4c4b": {
      name: "Mary",
      id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
      email: "m@g.com",
    },
  },
};

describe("calculation", () => {
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
      users: {
        "3d17f607-5e69-4794-9c20-9a65a09c4c4b": {
          ...PARTY.items[0].users["3d17f607-5e69-4794-9c20-9a65a09c4c4b"],
          value: 2,
          checked: true,
        },
        "4c086579-760b-4593-96bc-04c485adcb17": {
          ...PARTY.items[0].users["4c086579-760b-4593-96bc-04c485adcb17"],
          value: 0,
          checked: true,
        },
      },
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
      expect(
        getPartyUserBaseTotal(
          PARTY.items,
          "4c086579-760b-4593-96bc-04c485adcb17"
        )
      ).toBe(100);
    });
  });

  describe("getPartyUserDiscount", () => {
    it("should return discount for user", () => {
      expect(
        getPartyUserDiscount(
          PARTY.items,
          "4c086579-760b-4593-96bc-04c485adcb17"
        )
      ).toBe(10);
    });
    it("should return discount for user who drunk all item", () => {
      const items = [
        {
          ...PARTY.items[0],
          users: {
            "4c086579-760b-4593-96bc-04c485adcb17": {
              ...PARTY.items[0].users["4c086579-760b-4593-96bc-04c485adcb17"],
              value: 2,
            },
            "3d17f607-5e69-4794-9c20-9a65a09c4c4b": {
              ...PARTY.items[0].users["3d17f607-5e69-4794-9c20-9a65a09c4c4b"],
              value: 0,
            },
          },
        },
      ];
      expect(
        getPartyUserDiscount(items, "4c086579-760b-4593-96bc-04c485adcb17")
      ).toBe(20);
      expect(
        getPartyUserDiscount(items, "3d17f607-5e69-4794-9c20-9a65a09c4c4b")
      ).toBe(0);
    });
    it("should ignore values if item is shared", () => {
      const items = [
        {
          ...PARTY.items[0],
          users: {
            "3d17f607-5e69-4794-9c20-9a65a09c4c4b": {
              ...PARTY.items[0].users["3d17f607-5e69-4794-9c20-9a65a09c4c4b"],
              value: 2,
              checked: true,
            },
            "4c086579-760b-4593-96bc-04c485adcb17": {
              ...PARTY.items[0].users["4c086579-760b-4593-96bc-04c485adcb17"],
              value: 0,
              checked: true,
            },
          },
          equally: true,
        },
      ];
      expect(
        getPartyUserDiscount(items, "4c086579-760b-4593-96bc-04c485adcb17")
      ).toBe(10);
      expect(
        getPartyUserDiscount(items, "3d17f607-5e69-4794-9c20-9a65a09c4c4b")
      ).toBe(10);
    });
  });

  describe("getPartyUserTotal", () => {
    it("should return total sum for user", () => {
      expect(
        getPartyUserTotal(PARTY.items, "4c086579-760b-4593-96bc-04c485adcb17")
      ).toBe(90);
    });
  });

  const items: Item[] = [
    {
      amount: 1,
      price: 1,
      equally: false,
      name: "фыва",
      discount: 0,
      id: "bd2cd2ae-8e48-4709-9c3b-5f5acfb58c0a",
      users: {
        "4c086579-760b-4593-96bc-04c485adcb17": {
          id: "4c086579-760b-4593-96bc-04c485adcb17",
          value: 0,
        },
      },
    },
    {
      amount: 2,
      price: 1,
      equally: false,
      name: "фыва",
      discount: 0,
      id: "id2",
      users: {
        "4c086579-760b-4593-96bc-04c485adcb17": {
          id: "4c086579-760b-4593-96bc-04c485adcb17",
          value: 1,
        },
        "3d17f607-5e69-4794-9c20-9a65a09c4c4b": {
          id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
          value: 1,
        },
      },
    },
    {
      amount: 1,
      price: 0,
      equally: false,
      name: "dsfsdf",
      discount: 0,
      id: "9b3b7589-5a0c-4e4f-a8f0-b9d818b5b15c",
      users: {
        "4c086579-760b-4593-96bc-04c485adcb17": {
          id: "4c086579-760b-4593-96bc-04c485adcb17",
          value: 1,
        },
      },
    },
    {
      amount: 1,
      price: 0,
      equally: true,
      name: "dsfsdf",
      discount: 0,
      id: "id1",
      users: {
        "4c086579-760b-4593-96bc-04c485adcb17": {
          id: "4c086579-760b-4593-96bc-04c485adcb17",
          value: 0,
          checked: true,
        },
      },
    },
  ];

  describe("splitItems", () => {
    it("should return users` items", () => {
      expect(splitItems(items, "4c086579-760b-4593-96bc-04c485adcb17")).toEqual(
        [
          [
            {
              amount: 2,
              discount: 0,
              equally: false,
              id: "id2",
              name: "фыва",
              originalIndex: 1,
              participants: 2,
              price: 1,
              total: 1,
              users: {
                "4c086579-760b-4593-96bc-04c485adcb17": {
                  id: "4c086579-760b-4593-96bc-04c485adcb17",
                  value: 1,
                },
                "3d17f607-5e69-4794-9c20-9a65a09c4c4b": {
                  id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
                  value: 1,
                },
              },
            },
            {
              amount: 1,
              discount: 0,
              equally: false,
              id: "9b3b7589-5a0c-4e4f-a8f0-b9d818b5b15c",
              name: "dsfsdf",
              originalIndex: 2,
              participants: 1,
              price: 0,
              total: 0,
              users: {
                "4c086579-760b-4593-96bc-04c485adcb17": {
                  id: "4c086579-760b-4593-96bc-04c485adcb17",
                  value: 1,
                },
              },
            },
            {
              amount: 1,
              discount: 0,
              equally: true,
              id: "id1",
              name: "dsfsdf",
              originalIndex: 3,
              participants: 1,
              price: 0,
              total: 0,
              users: {
                "4c086579-760b-4593-96bc-04c485adcb17": {
                  id: "4c086579-760b-4593-96bc-04c485adcb17",
                  value: 0,
                  checked: true,
                },
              },
            },
          ],
          [
            {
              amount: 1,
              discount: 0,
              equally: false,
              id: "bd2cd2ae-8e48-4709-9c3b-5f5acfb58c0a",
              name: "фыва",
              originalIndex: 0,
              price: 1,
              users: {
                "4c086579-760b-4593-96bc-04c485adcb17": {
                  id: "4c086579-760b-4593-96bc-04c485adcb17",
                  value: 0,
                },
              },
            },
            {
              amount: 2,
              discount: 0,
              equally: false,
              id: "id2",
              isMuted: true,
              name: "фыва",
              originalIndex: 1,
              price: 1,
              users: {
                "4c086579-760b-4593-96bc-04c485adcb17": {
                  id: "4c086579-760b-4593-96bc-04c485adcb17",
                  value: 1,
                },
                "3d17f607-5e69-4794-9c20-9a65a09c4c4b": {
                  id: "3d17f607-5e69-4794-9c20-9a65a09c4c4b",
                  value: 1,
                },
              },
            },
          ],
        ]
      );
    });
    it("should work items if there is no value for user", () => {
      expect(
        splitItems(buggyParty.items, "de1d5da9-dcad-4cab-ae42-cd28d93be8f5")
      ).toEqual([
        [
          {
            amount: 1,
            createdOn: "2023-12-15T19:02:11.229060",
            discount: 0,
            equally: true,
            id: "eff048d0-424d-476a-a6ef-c6959ac7e3d0",
            name: "kartoha",
            originalIndex: 0,
            participants: 2,
            price: 60,
            total: 30,
            users: {
              "044b5e8a-0805-4728-a728-dba35c0c6458": {
                id: "044b5e8a-0805-4728-a728-dba35c0c6458",
                name: "kljlj",
                value: 0,
                checked: true,
              },
              "307d2524-bfb3-4192-bc60-62e460ebf0bb": {
                id: "307d2524-bfb3-4192-bc60-62e460ebf0bb",
              },
              "de1d5da9-dcad-4cab-ae42-cd28d93be8f5": {
                id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5",
                name: "marusel",
                value: 0,
                checked: true,
              },
            },
          },
        ],
        [
          {
            amount: 3,
            createdOn: "2023-12-15T20:39:51.214996",
            discount: 0,
            equally: true,
            id: "6baf97dc-7280-4ddf-b5f1-cce47e50b77c",
            name: "nn",
            originalIndex: 1,
            price: 40,
            users: {
              "044b5e8a-0805-4728-a728-dba35c0c6458": {
                id: "044b5e8a-0805-4728-a728-dba35c0c6458",
              },
              "307d2524-bfb3-4192-bc60-62e460ebf0bb": {
                id: "307d2524-bfb3-4192-bc60-62e460ebf0bb",
              },
              "de1d5da9-dcad-4cab-ae42-cd28d93be8f5": {
                id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5",
              },
            },
          },
        ],
      ]);
    });
  });

  describe("getFullDiscount", () => {
    it("should return percent of full amount", () => {
      expect(getFullDiscount(150, 10, true)).toBe(15);
    });
    it("should return discount value", () => {
      expect(getFullDiscount(150, 10, false)).toBe(10);
    });
  });
});

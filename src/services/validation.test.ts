import { itemsSchema } from "./validation";

const items = {
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
          email: "mail@mail.com",
        },
      ],
    },
  ],
};

describe("items schema", () => {
  it("requires item's price", async () => {
    await expect(itemsSchema.validate(items)).resolves.toBeTruthy();
  });
});

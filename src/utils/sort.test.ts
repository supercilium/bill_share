import { sortPartyUsers } from "./sort";

const party = {
  owner: { name: "marusel", id: "567b52b5-9315-47d5-9264-1603abb49360" },
  name: "party",
  discount: 0,
  id: "744bef28-038c-4ccf-94d2-c5fb81edfc36",
  isPercentage: true,
  items: [
    {
      amount: 1,
      price: 100,
      equally: false,
      name: "nn",
      discount: 0,
      id: "28e0a10c-affc-42b1-8ba9-f737654a97bf",
      createdOn: "2023-04-28T17:24:35.550149",
      users: [
        { name: "ama", id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55", value: 0 },
      ],
    },
    {
      amount: 6,
      price: 10,
      equally: false,
      name: "mama",
      discount: 0,
      id: "2a0c21bb-893c-47e6-bc0e-b4fe3a267d71",
      createdOn: "2023-04-28T17:25:13.134696",
      users: [
        { name: "ama", id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55", value: 1 },
        { name: "eee", id: "441dc9fd-a3c3-473e-8534-baaf587be9b1", value: 3 },
        {
          name: "marusel",
          id: "567b52b5-9315-47d5-9264-1603abb49360",
          value: 0,
        },
      ],
    },
    {
      amount: 1,
      price: 1000,
      equally: true,
      name: "tvhuser",
      discount: 0,
      id: "1eb75290-d376-4028-8535-75f377a87620",
      createdOn: "2023-04-28T18:06:48.212729",
      users: [
        { name: "ama", id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55", value: 0 },
        { name: "eee", id: "441dc9fd-a3c3-473e-8534-baaf587be9b1", value: 0 },
        {
          name: "marusel",
          id: "567b52b5-9315-47d5-9264-1603abb49360",
          value: 0,
        },
      ],
    },
    {
      amount: 1,
      price: 10,
      equally: false,
      name: "wde",
      discount: 0,
      id: "ca3b49ab-6ffd-4f95-99dd-e222b80a01fe",
      createdOn: "2023-04-28T18:07:38.570126",
      users: [
        { name: "eee", id: "441dc9fd-a3c3-473e-8534-baaf587be9b1", value: 1 },
      ],
    },
  ],
  users: [
    { name: "ama", id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55" },
    { name: "eee", id: "441dc9fd-a3c3-473e-8534-baaf587be9b1" },
    { name: "marusel", id: "567b52b5-9315-47d5-9264-1603abb49360" },
  ],
};

const partyWithDifferentSorting = {
  owner: { name: "marusel", id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5" },
  name: "party",
  discount: 0,
  id: "3d983b5e-d287-49fe-bc37-e8f5bbd2711f",
  isPercentage: true,
  items: [
    {
      amount: 1,
      price: 60,
      equally: true,
      name: "kartoha",
      discount: 0,
      id: "eff048d0-424d-476a-a6ef-c6959ac7e3d0",
      createdOn: "2023-12-15T19:02:11.229060",
      users: [
        {
          name: "marusel",
          id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5",
          value: 0,
        },
        {
          name: "kljlj",
          id: "044b5e8a-0805-4728-a728-dba35c0c6458",
          value: 0,
        },
      ],
    },
    {
      amount: 3,
      price: 40,
      equally: true,
      name: "nn",
      discount: 0,
      id: "6baf97dc-7280-4ddf-b5f1-cce47e50b77c",
      createdOn: "2023-12-15T20:39:51.214996",
      users: [],
    },
    {
      amount: 3,
      price: 40,
      equally: true,
      name: "new",
      discount: 0,
      id: "new-id",
      createdOn: "2023-12-15T20:39:51.214996",
      users: [
        {
          id: "044b5e8a-0805-4728-a728-dba35c0c6458",
          name: "kljlj",
          value: 0,
        },
      ],
    },
  ],
  users: [
    { name: "kljlj", id: "044b5e8a-0805-4728-a728-dba35c0c6458" },
    { name: "kljljh", id: "307d2524-bfb3-4192-bc60-62e460ebf0bb" },
    { name: "marusel", id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5" },
  ],
};

describe("sortPartyUsers", () => {
  test("should sort users in items", () => {
    const res = sortPartyUsers(party, "567b52b5-9315-47d5-9264-1603abb49360");
    expect(res.users).toEqual({
      "441dc9fd-a3c3-473e-8534-baaf587be9b1": {
        id: "441dc9fd-a3c3-473e-8534-baaf587be9b1",
        name: "eee",
      },
      "567b52b5-9315-47d5-9264-1603abb49360": {
        id: "567b52b5-9315-47d5-9264-1603abb49360",
        name: "marusel",
      },
      "9c5ea836-9b4a-4050-bd29-cfadf045fd55": {
        id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55",
        name: "ama",
      },
    });
    expect(res.items).toEqual([
      {
        amount: 1,
        price: 100,
        equally: false,
        name: "nn",
        discount: 0,
        id: "28e0a10c-affc-42b1-8ba9-f737654a97bf",
        createdOn: "2023-04-28T17:24:35.550149",
        users: {
          "441dc9fd-a3c3-473e-8534-baaf587be9b1": {
            id: "441dc9fd-a3c3-473e-8534-baaf587be9b1",
          },
          "567b52b5-9315-47d5-9264-1603abb49360": {
            id: "567b52b5-9315-47d5-9264-1603abb49360",
          },
          "9c5ea836-9b4a-4050-bd29-cfadf045fd55": {
            id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55",
            name: "ama",
            value: 0,
          },
        },
      },
      {
        amount: 6,
        price: 10,
        equally: false,
        name: "mama",
        discount: 0,
        id: "2a0c21bb-893c-47e6-bc0e-b4fe3a267d71",
        createdOn: "2023-04-28T17:25:13.134696",
        users: {
          "441dc9fd-a3c3-473e-8534-baaf587be9b1": {
            id: "441dc9fd-a3c3-473e-8534-baaf587be9b1",
            name: "eee",
            value: 3,
          },
          "567b52b5-9315-47d5-9264-1603abb49360": {
            id: "567b52b5-9315-47d5-9264-1603abb49360",
            name: "marusel",
            value: 0,
          },
          "9c5ea836-9b4a-4050-bd29-cfadf045fd55": {
            id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55",
            name: "ama",
            value: 1,
          },
        },
      },
      {
        amount: 1,
        price: 1000,
        equally: true,
        name: "tvhuser",
        discount: 0,
        id: "1eb75290-d376-4028-8535-75f377a87620",
        createdOn: "2023-04-28T18:06:48.212729",
        users: {
          "441dc9fd-a3c3-473e-8534-baaf587be9b1": {
            id: "441dc9fd-a3c3-473e-8534-baaf587be9b1",
            name: "eee",
            value: 0,
          },
          "567b52b5-9315-47d5-9264-1603abb49360": {
            id: "567b52b5-9315-47d5-9264-1603abb49360",
            name: "marusel",
            value: 0,
          },
          "9c5ea836-9b4a-4050-bd29-cfadf045fd55": {
            id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55",
            name: "ama",
            value: 0,
          },
        },
      },
      {
        amount: 1,
        price: 10,
        equally: false,
        name: "wde",
        discount: 0,
        id: "ca3b49ab-6ffd-4f95-99dd-e222b80a01fe",
        createdOn: "2023-04-28T18:07:38.570126",
        users: {
          "441dc9fd-a3c3-473e-8534-baaf587be9b1": {
            id: "441dc9fd-a3c3-473e-8534-baaf587be9b1",
            name: "eee",
            value: 1,
          },
          "567b52b5-9315-47d5-9264-1603abb49360": {
            id: "567b52b5-9315-47d5-9264-1603abb49360",
          },
          "9c5ea836-9b4a-4050-bd29-cfadf045fd55": {
            id: "9c5ea836-9b4a-4050-bd29-cfadf045fd55",
          },
        },
      },
    ]);
  });
  test("should sort a party when there is no participants or they are in different order", () => {
    expect(
      sortPartyUsers(
        partyWithDifferentSorting,
        "de1d5da9-dcad-4cab-ae42-cd28d93be8f5"
      )
    ).toEqual({
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
            },
            "307d2524-bfb3-4192-bc60-62e460ebf0bb": {
              id: "307d2524-bfb3-4192-bc60-62e460ebf0bb",
            },
            "de1d5da9-dcad-4cab-ae42-cd28d93be8f5": {
              id: "de1d5da9-dcad-4cab-ae42-cd28d93be8f5",
              name: "marusel",
              value: 0,
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
        {
          amount: 3,
          createdOn: "2023-12-15T20:39:51.214996",
          discount: 0,
          equally: true,
          id: "new-id",
          name: "new",
          price: 40,
          users: {
            "044b5e8a-0805-4728-a728-dba35c0c6458": {
              id: "044b5e8a-0805-4728-a728-dba35c0c6458",
              name: "kljlj",
              value: 0,
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
    });
  });
});

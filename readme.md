# EVENTS

- create party (MVP) (creator = master/host)
- user connected (+ add column automatically) (MVP) (user = guest)
- user disconnected
- change party state - checkboxes/inputs - what model will be changed? user-product-new?
- add product (row) (MVP)
- edit product (row)
- delete product (row)
- add column (add user manually) (MVP)
- remove column (manually)
- edit column (manually)
- close party

# PRIVILEGES

## master:

- CRUD product
- CRUD user
- close party

## guest:

- ADD-UPDATE product
- UPDATE user-self

# party json:

```
{
    "name": "party name",
    "users": [
        {
            "name": "u1",
            "accepted"?: true,
            "paid"?: true,
            "isMaster"?: true
        }
    ],
    "items": [
        {
            "name": "beer",
            "price": 100,
            "amount": 3,
            "equally": true,
            "discount": 0.1,
            "users": [
                {
                    "user": "u1",
                    "value": 1
                },
                {
                    "user": "u2",
                    "value": 2
                }
            ]
        }
    ]
}
```

actions

"create party":
{ user: "Rus", partyName: "party one" } -> party: { id: "uuid for party", name: "party one", owner: { name: "Rus", id: "uuid for Rus" }, users: [], item: [] }

? "finish party": - no one can add items & users
partyId

"add user":
user, partyId -> { id, name, owner: { name, id }, users: [{ name, id }], items: [] }

"remove user":
userId, partyId -> { id, name, owner: { name, id }, users: [], items: [] }

"add item":
userId, partyId, item -> { id: "uuid for party", name: "party one", owner: { name: "Rus", id: "uuid for Rus" }, users: [], items: [{ id: itemId }] }

"update item":
userId, partyId, itemId, item: {...newItemData} => { id: "uuid for party", name: "party one", owner: { name: "Rus", id: "uuid for Rus" }, users: [], items: [{ ...newItemData }] }

"remove item":
userId, partyId, itemId => { id: "uuid for party", name: "party one", owner: { name: "Rus", id: "uuid for Rus" }, users: [], items: [] }

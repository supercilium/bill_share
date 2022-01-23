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

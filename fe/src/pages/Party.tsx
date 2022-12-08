import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { PartyInterface } from "../types/party";
import { createUser, getPartyById } from "../__api__/party";
import { socket } from "../__api__/socket";

export const Party = () => {
  const { partyId } = useParams();
  const { id, userName: name } =
    JSON.parse(localStorage.getItem("user") || "{}") || {};
  const [party, setParty] = useState<PartyInterface | null>(null);
  const [userName, setUserName] = useState<string | undefined>();
  const [itemName, setItemName] = useState<string | undefined>();
  const [itemPrice, setItemPrice] = useState<number | undefined>();
  const fetchParty = async (id: string) => {
    try {
      const parties = await getPartyById(id);
      setParty(parties as PartyInterface);
    } catch (err) {
      console.log(err);
    }
  };

  const eventHandler = (event: MessageEvent<string>) => {
    setParty(JSON.parse(event.data));
    console.log(event);
  };

  useEffect(() => {
    socket.addEventListener("message", eventHandler);

    return () => {
      socket.removeEventListener("message", eventHandler);
    };
  }, []);

  useEffect(() => {
    if (partyId) {
      fetchParty(partyId);
    }
  }, [partyId]);

  const handleAddUser = () => {
    socket.send(
      JSON.stringify({ type: "add user", userName: userName, partyId })
    );
  };
  const handleRemoveUser = (userId: string) => {
    socket.send(JSON.stringify({ type: "remove user", userId, partyId }));
  };
  const handleAddItem = () => {
    socket.send(
      JSON.stringify({
        type: "add item",
        userId: id,
        partyId,
        itemName: itemName,
        itemPrice: itemPrice,
      })
    );
  };
  const handleUpdateItem = () => {
    socket.send(
      JSON.stringify({
        type: "update item",
        userId: id,
        partyId,
        itemId: "someItemId",
      })
    );
  };
  const handleRemoveItem = (id: string) => {
    socket.send(
      JSON.stringify({
        type: "remove item",
        userId: id,
        partyId,
        itemId: id,
      })
    );
  };
  const handleCreateUser = async () => {
    const response = await createUser({ userName, partyId });
    localStorage.setItem("user", JSON.stringify(response));

    setUserName(undefined);
  };

  if (!party) {
    return (
      <div className="container">
        <h2 className="title is-2 my-5">No party</h2>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="container">
        <h2 className="title is-2 my-5">Enter your name</h2>
        <div className="field">
          <label htmlFor="username" className="label">
            Enter your name
          </label>
          <input
            className="input"
            type="text"
            name="username"
            value={userName}
            onChange={({ target }) => setUserName(target.value)}
          />
        </div>
        <button
          type="submit"
          className="button"
          onClick={() => handleCreateUser()}
        >
          Join party
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title is-2 my-5">
        Hello, {name}! Welcome to {party?.name}
      </h2>
      <p className="subtitle is-4 my-4">
        Link to this party:{" "}
        <span className="tag is-medium">{window.location.href}</span>
      </p>
      <p className="subtitle is-4 my-4">Party maker: {party.owner.name}</p>

      <div className="columns">
        <div className="column">
          {party.users.length > 0 ? (
            <>
              <p className="subtitle is-4 my-4">
                Here we have some guys having fun:
              </p>
              {party.users.map((user) => (
                <p
                  key={user.id}
                  className="is-size-4 is-flex is-align-items-center"
                >
                  {user.name}{" "}
                  <button
                    type="button"
                    className="delete ml-2"
                    onClick={() => handleRemoveUser(user.id)}
                  ></button>
                </p>
              ))}
            </>
          ) : null}
        </div>
        <div className="column">
          {party.users.length > 0 ? (
            <>
              <p className="subtitle is-4 my-4">
                And they have something to share:
              </p>
              {party.items.map((item) => (
                <p
                  key={item.id}
                  className="is-size-4 is-flex is-align-items-center"
                >
                  {item.name}{" "}
                  {item.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                  <button
                    type="button"
                    className="delete ml-2"
                    onClick={() => handleRemoveItem(item.id)}
                  ></button>
                </p>
              ))}
            </>
          ) : null}
        </div>
      </div>
      <div className="block">
        <h3 className="title is-4 my-2">Adding a user</h3>
        <div className="field">
          <label htmlFor="userName" className="label">
            Enter user name
          </label>
          <input
            className="input"
            type="text"
            name="userName"
            value={userName}
            onChange={({ target }) => setUserName(target.value)}
          />
        </div>
        <button className="button" disabled={!userName} onClick={handleAddUser}>
          Add user
        </button>
      </div>
      <div className="block">
        <h3 className="title is-4 my-2">Adding an item</h3>
        <div className="field">
          <label htmlFor="itemName" className="label">
            Enter item name
          </label>
          <input
            className="input"
            type="text"
            name="itemName"
            value={itemName}
            onChange={({ target }) => setItemName(target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="itemPrice" className="label">
            Enter item price
          </label>
          <input
            className="input"
            type="number"
            name="itemPrice"
            value={itemPrice}
            onChange={({ target }) => setItemPrice(+target.value)}
          />
        </div>
        <button
          className="button"
          disabled={!itemName || !itemPrice}
          onClick={handleAddItem}
        >
          Add item
        </button>
      </div>

      <div className="block">
        <h3 className="title is-4 my-2">Postponed</h3>

        <div className="buttons">
          <button className="button" onClick={handleUpdateItem}>
            Update item
          </button>
        </div>
      </div>
    </div>
  );
};

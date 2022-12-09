import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Block, Columns, Footer, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { PartyInterface } from "../types/party";
import { createUser, getPartyById } from "../__api__/party";
import { socket } from "../__api__/socket";

export const Party = () => {
  const { partyId } = useParams();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}") || {}
  );
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
  }, [partyId, currentUser]);

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
        userId: currentUser.id,
        partyId,
        itemName: itemName,
        itemPrice: itemPrice,
      })
    );
  };
  const handleUpdateItem = (itemId: string) => {
    socket.send(
      JSON.stringify({
        type: "update item",
        userId: currentUser.id,
        partyId,
        itemId,
      })
    );
  };
  const handleRemoveItem = (id: string) => {
    socket.send(
      JSON.stringify({
        type: "remove item",
        userId: currentUser.id,
        partyId,
        itemId: id,
      })
    );
  };
  const handleCreateUser = async () => {
    const response = await createUser({ userName, partyId });
    localStorage.setItem("user", JSON.stringify(response));

    setCurrentUser(response);
  };

  const renderMain = () => {
    if (!party) {
      return null;
    }
    if (
      !currentUser.id ||
      ![...party.users, party.owner].find((user) => user.id === currentUser.id)
    ) {
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
      <>
        <p className="subtitle is-4 my-4">
          Link to this party:{" "}
          <span className="tag is-medium">{window.location.href}</span>
        </p>
        <p className="subtitle is-4 my-4">Party maker: {party.owner.name}</p>

        <Columns>
          <div>
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
          <div>
            {party.items.length > 0 ? (
              <>
                <p className="subtitle is-4 my-4">
                  And they have something to share:
                </p>
                {party.items.map((item) => (
                  <p
                    key={item.id}
                    className="is-size-4 is-flex is-align-items-center mb-2"
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
                    <button
                      className="button ml-2"
                      onClick={() => handleUpdateItem(item.id)}
                    >
                      Update item
                    </button>
                    {item.users?.length > 0 &&
                      item.users.map(({ id }) => (
                        <span className="tag is-medium ml-2">
                          {party.users.find((user) => user.id === id)?.name}
                        </span>
                      ))}
                  </p>
                ))}
              </>
            ) : null}
          </div>
        </Columns>
        <Block title="Adding a user">
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
          <button
            className="button"
            disabled={!userName}
            onClick={handleAddUser}
          >
            Add user
          </button>
        </Block>
        <Block title="Adding an item">
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
        </Block>
      </>
    );
  };

  return (
    <PlainLayout
      Header={
        <Header>
          {!party ? (
            <h2 className="title is-2 my-5">No party</h2>
          ) : (
            <h2 className="title is-2 my-5">
              Hello, {currentUser.name}! Welcome to {party?.name}
            </h2>
          )}
        </Header>
      }
      Footer={<Footer>foo-footer</Footer>}
      Main={<Main>{renderMain()}</Main>}
    />
  );
};

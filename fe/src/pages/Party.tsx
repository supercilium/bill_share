import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { PartyInterface } from "../types/party";
import { getPartyById } from "../__api__/party";
import { socket } from "../__api__/socket";

export const Party = () => {
  const { partyId } = useParams();
  const [party, setParty] = useState<PartyInterface | null>(null);
  const fetchParty = async (id: string) => {
    try {
      const parties = await getPartyById(id);
      setParty(parties as PartyInterface);
    } catch (err) {
      console.log(err);
    }
  };

  const eventHandler = (data: Event) => {
    // setParty(data);
    console.log(data);
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
      JSON.stringify({ type: "add user", userName: "someUserId", partyId })
    );
  };
  const handleRemoveUser = (userId: string) => {
    socket.send(JSON.stringify({ type: "remove user", userId, partyId }));
  };
  const handleAddItem = () => {
    socket.send(
      JSON.stringify({
        type: "add item",
        userId: "someUserId",
        partyId,
        itemId: "someItemId",
      })
    );
  };
  const handleUpdateItem = () => {
    socket.send(
      JSON.stringify({
        type: "update item",
        userId: "someUserId",
        partyId,
        itemId: "someItemId",
      })
    );
  };
  const handleRemoveItem = () => {
    socket.send(
      JSON.stringify({
        type: "remove item",
        userId: "someUserId",
        partyId,
        itemId: "someItemId",
      })
    );
  };

  if (!party) {
    return (
      <div className="container">
        <h2 className="title is-2 my-5">No party</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title is-2 my-5">Welcome to {party?.name}</h2>
      <div className="columns">
        <div className="column">
          <p className="subtitle is-4 my-4">Party maker: {party.master.name}</p>
          {party.users.length > 0 ? (
            <>
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
        <p className="subtitle is-4 my-4 column">
          Link to this party:{" "}
          <span className="tag is-medium">{window.location.href}</span>
        </p>
      </div>
      <div className="buttons">
        <button className="button" onClick={handleAddUser}>
          Add user
        </button>
        <button className="button" onClick={handleAddItem}>
          Add item
        </button>
        <button className="button" onClick={handleUpdateItem}>
          Update item
        </button>
        <button className="button" onClick={handleRemoveItem}>
          Remove item
        </button>
      </div>
    </div>
  );
};

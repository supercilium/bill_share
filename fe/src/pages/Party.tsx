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

  useEffect(() => {
    socket.on("add user", (data) => {
      setParty(data);
    });
    socket.on("remove user", (data) => {
      setParty(data);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    if (partyId) {
      fetchParty(partyId);
    }
  }, [partyId]);

  const handleAddUser = () => {
    socket.emit(
      "add user",
      JSON.stringify({ userName: "someUserId", partyId })
    );
  };
  const handleRemoveUser = (userId: string) => {
    socket.emit("remove user", JSON.stringify({ userId, partyId }));
  };
  const handleAddItem = () => {
    socket.emit(
      "add item",
      JSON.stringify({ userId: "someUserId", partyId, itemId: "someItemId" })
    );
  };
  const handleUpdateItem = () => {
    socket.emit(
      "update item",
      JSON.stringify({ userId: "someUserId", partyId, itemId: "someItemId" })
    );
  };
  const handleRemoveItem = () => {
    socket.emit(
      "remove item",
      JSON.stringify({ userId: "someUserId", partyId, itemId: "someItemId" })
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

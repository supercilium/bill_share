import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { PartyInterface } from "../types/party";
import { getPartyById } from "../__api__/party";
import { socket } from "../__api__/socket";

export const Party = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

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
    if (partyId) {
      fetchParty(partyId);
    }
  }, [partyId]);

  const handleAddUser = () => {
    socket.emit("add user", JSON.stringify({ userId: "someUserId", partyId }));
  };
  const handleRemoveUser = () => {
    socket.emit(
      "remove user",
      JSON.stringify({ userId: "someUserId", partyId })
    );
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
    return <div>No party</div>;
  }

  return (
    <div>
      <div>Welcome to {party?.id}</div>
      <div>
        Link to this party: <span>{window.location.href}</span>
      </div>
      <button onClick={handleAddUser}>Add user</button>
      <button onClick={handleRemoveUser}>Remove user</button>
      <button onClick={handleAddItem}>Add item</button>
      <button onClick={handleUpdateItem}>Update item</button>
      <button onClick={handleRemoveItem}>Remove item</button>
    </div>
  );
};

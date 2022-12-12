import { FC } from "react";
import { useParams } from "react-router";
import { Block } from "../components";
import { PartyInterface } from "../types/party";
import { socket } from "../__api__/socket";

export const PartyForm: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
}> = ({ party, currentUser }) => {
  const { users } = party;
  const { partyId } = useParams();
  const handleChange = async (userId: string, itemId: string) => {
    socket.send(
      JSON.stringify({
        type: "update item",
        userId,
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

  return (
    <Block title="Party form">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `120px 60px 60px repeat(${users.length}, 25px)`,
          gap: "16px",
        }}
      >
        <span className="is-size-6">Item name</span>
        <span className="is-size-6">Amount</span>
        <span className="is-size-6">Price</span>
        {users.map(({ id, name }) => (
          <span key={id} className="is-size-6">
            {name}
          </span>
        ))}
      </div>

      <form>
        {party.items.map((item) => (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `120px 60px 60px repeat(${users.length}, 25px)`,
              gap: "16px",
            }}
            key={item.id}
          >
            <span className="is-size-4 is-flex is-align-items-center ">
              {item.name}
              <button
                type="button"
                className="delete ml-2"
                onClick={() => handleRemoveItem(item.id)}
              ></button>
            </span>
            <span className="is-size-4">{item.amount}</span>
            <span className="is-size-4">{item.price}</span>
            {users.map(({ id }) => (
              <input
                key={id}
                type="checkbox"
                className="is-size-4 checkbox"
                checked={!!item.users?.find((user) => user.id === id)}
                onChange={() => handleChange(id, item.id)}
              />
            ))}
          </div>
        ))}
      </form>
    </Block>
  );
};

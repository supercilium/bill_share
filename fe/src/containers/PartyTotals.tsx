import { FC } from "react";
import { Block } from "../components";
import { PartyInterface } from "../types/party";

export const PartyTotals: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
}> = ({ party, currentUser }) => {
  if (!party.items.length) {
    return null;
  }

  return (
    <Block>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `200px 60px 70px 60px 3rem repeat(${party.users.length}, 2rem)`,
          gap: "16px",
        }}
      >
        <span className="is-size-6" />
        <span className="is-size-6" />
        <span className="is-size-6">
          {party.items.reduce(
            (acc, item) => acc + item.price - item.price * (item.discount || 0),
            0
          )}
        </span>
        <span className="is-size-6">
          {party.items.reduce(
            (acc, item) => acc + item.price * (item.discount || 0),
            0
          )}
        </span>
        <span className="is-size-6" />
        {party.users?.length > 0 ? (
          party.users.map(({ id }) => (
            <span
              key={id}
              style={{ transform: "translateX(-4px) rotate(-42deg)" }}
              className={`is-size-6${
                id === currentUser.id ? " has-text-info" : ""
              }`}
            >
              {party.items
                .reduce((acc, item) => {
                  const participants = item.users.filter(
                    (user) => user.value > 0
                  );
                  if (participants.some((user) => user.id === id)) {
                    return (
                      acc +
                      (item.price - item.price * (item.discount || 0)) /
                        participants.length
                    );
                  }
                  return acc;
                }, 0)
                .toFixed(2)}
            </span>
          ))
        ) : (
          <div />
        )}
      </div>
    </Block>
  );
};

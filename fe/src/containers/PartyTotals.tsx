import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Block } from "../components";
import { FormSettings } from "../contexts/PartySettingsContext";
import { PartyFormLayout } from "../layouts/partyFormLayout";
import { PartyInterface } from "../types/party";

export const PartyTotals: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
}> = ({ party, currentUser }) => {
  const { watch } = useFormContext<FormSettings>();

  if (!party.items.length) {
    return null;
  }
  const partySettings = watch();

  return (
    <Block>
      <PartyFormLayout
        isDiscountVisible={partySettings.isDiscountVisible}
        isEquallyVisible={partySettings.isEquallyVisible}
        amountOfUsers={party.users.length}
      >
        <span className="is-size-6" />
        <span className="is-size-6" />
        <span className="is-size-6">
          {party.items.reduce(
            (acc, item) => acc + item.price - item.price * (item.discount || 0),
            0
          )}
        </span>
        {partySettings.isDiscountVisible && (
          <span className="is-size-6">
            {party.items.reduce(
              (acc, item) => acc + item.price * (item.discount || 0),
              0
            )}
          </span>
        )}
        {partySettings.isEquallyVisible && <span className="is-size-6" />}
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
      </PartyFormLayout>
    </Block>
  );
};

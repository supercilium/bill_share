import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Block } from "../components";
import { FormSettings } from "../contexts/PartySettingsContext";
import { PartyFormLayout } from "../layouts/partyFormLayout";
import { PartyInterface } from "../types/party";
import {
  getPartyTotal,
  getPartyUserTotal,
  getTotalDiscount,
} from "../utils/calculation";

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
        <span className="is-size-6">{getPartyTotal(party.items)}</span>
        {partySettings.isDiscountVisible && (
          <span className="is-size-6">{getTotalDiscount(party.items)}</span>
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
              {getPartyUserTotal(party.items, id)}
            </span>
          ))
        ) : (
          <div />
        )}
      </PartyFormLayout>
    </Block>
  );
};

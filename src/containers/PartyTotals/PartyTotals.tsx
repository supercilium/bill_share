import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Block, PartyFormLayout } from "../../components";
import { RotatedText } from "../../components/styled/rotatedText";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { PartyInterface } from "../../types/party";
import {
  getBaseTotal,
  getPartyTotal,
  getPartyUserBaseTotal,
  getPartyUserDiscount,
  getPartyUserTotal,
  getTotalDiscount,
} from "../../utils/calculation";

export const PartyTotals: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
}> = ({ party, currentUser }) => {
  const { watch, setValue } = useFormContext<FormSettings>();

  if (!party.items.length) {
    return null;
  }
  const partySettings = watch();

  const totalDiscount = getTotalDiscount(party.items);
  const hasPartial = party.items.some(({ equally }) => !equally);

  return (
    <Block>
      <PartyFormLayout
        isDiscountVisible={partySettings.isDiscountVisible}
        isEquallyVisible={partySettings.isEquallyVisible}
        amountOfUsers={party.users.length}
        isEqually={!hasPartial}
      >
        <span className="is-size-6 has-text-right">Base total</span>
        <span className="is-size-6" />
        <span className="is-size-6">
          {getBaseTotal(party.items).toFixed(2)}
        </span>
        {partySettings.isDiscountVisible && <span className="is-size-6" />}
        {partySettings.isEquallyVisible && <span className="is-size-6" />}
        {party.users?.length > 0 ? (
          party.users.map((user) => (
            <RotatedText
              key={user.id}
              isRotated={hasPartial}
              className={`is-size-6 is-clickable${
                user.id === currentUser.id ? " has-text-info" : ""
              }`}
              title={`Open detailed view for ${user.name}`}
              onClick={() => {
                setValue("user", user);
                setValue("view", "user");
              }}
            >
              {getPartyUserBaseTotal(party.items, user.id).toFixed(2)}
            </RotatedText>
          ))
        ) : (
          <div />
        )}
      </PartyFormLayout>
      <PartyFormLayout
        isDiscountVisible={partySettings.isDiscountVisible}
        isEquallyVisible={partySettings.isEquallyVisible}
        amountOfUsers={party.users.length}
        isEqually={!hasPartial}
      >
        <span className="is-size-6 has-text-right">Discount</span>
        <span className="is-size-6" />
        <span className="is-size-6">
          {Number(partySettings.discount || 0).toFixed(2)}
        </span>
        {partySettings.isDiscountVisible && (
          <span className="is-size-6">{totalDiscount.toFixed(2)}</span>
        )}
        {partySettings.isEquallyVisible && <span className="is-size-6" />}
        {party.users?.length > 0 ? (
          party.users.map((user) => (
            <RotatedText
              key={user.id}
              isRotated={hasPartial}
              className={`is-size-6 is-clickable${
                user.id === currentUser.id ? " has-text-info" : ""
              }`}
              title={`Open detailed view for ${user.name}`}
              onClick={() => {
                setValue("user", user);
                setValue("view", "user");
              }}
            >
              {(
                getPartyUserDiscount(party.items, user.id) +
                getPartyUserBaseTotal(party.items, user.id) *
                  (partySettings.discountPercent || 0) *
                  0.01
              ).toFixed(2)}
            </RotatedText>
          ))
        ) : (
          <div />
        )}
      </PartyFormLayout>
      <hr className="my-3" />
      <PartyFormLayout
        isDiscountVisible={partySettings.isDiscountVisible}
        isEquallyVisible={partySettings.isEquallyVisible}
        amountOfUsers={party.users.length}
        isEqually={!hasPartial}
      >
        <span className="is-size-6 has-text-right">Total</span>
        <span className="is-size-6" />
        <span className="is-size-6">
          {(getPartyTotal(party.items) - (partySettings.discount || 0)).toFixed(
            2
          )}
        </span>
        {partySettings.isDiscountVisible && (
          <span className="is-size-6">
            {(totalDiscount + (partySettings.discount || 0)).toFixed(2)}
          </span>
        )}
        {partySettings.isEquallyVisible && <span className="is-size-6" />}
        {party.users?.length > 0 ? (
          party.users.map((user) => (
            <RotatedText
              key={user.id}
              isRotated={hasPartial}
              className={`is-size-6 is-clickable${
                user.id === currentUser.id ? " has-text-info" : ""
              }`}
              title={`Open detailed view for ${user.name}`}
              onClick={() => {
                setValue("user", user);
                setValue("view", "user");
              }}
            >
              {(
                getPartyUserTotal(party.items, user.id) *
                (1 - 0.01 * (partySettings.discountPercent || 0))
              ).toFixed(2)}
            </RotatedText>
          ))
        ) : (
          <div />
        )}
      </PartyFormLayout>
    </Block>
  );
};
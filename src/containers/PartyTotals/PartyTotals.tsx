import { FC } from "react";
import { Block } from "../../components";
import { PartyFormLayout } from "../../components/PartyFormLayout";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { PartyInterface } from "../../types/party";
import {
  getBaseTotal,
  getPartyTotal,
  getPartyUserBaseTotal,
  getPartyUserDiscount,
  getTotalDiscount,
} from "../../utils/calculation";

export const PartyTotals: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
  partySettings: FormSettings;
}> = ({ party, currentUser, partySettings }) => {
  if (!party.items.length) {
    return null;
  }

  const totalDiscount = getTotalDiscount(party.items);
  const hasPartial = party.items.some(({ equally }) => !equally);
  const baseTotal = getBaseTotal(party.items).toFixed(2);
  const sumClassName =
    baseTotal.toString().length >= 11 ? "is-size-7" : "is-size-6";
  const shouldRotate = baseTotal.toString().length >= 8 && !hasPartial;

  const discount = partySettings.isPercentage
    ? +baseTotal * (partySettings.discount || 0) * 0.01
    : partySettings.discount;

  return (
    <Block>
      <PartyFormLayout
        isDiscountVisible={partySettings.isDiscountVisible}
        isEquallyVisible={partySettings.isEquallyVisible}
        amountOfUsers={party.users.length}
      >
        <span className="is-size-6 has-text-right">Base total</span>
        <span className="is-size-6" />
        <span className={sumClassName}>{baseTotal}</span>
        <span
          className={`is-size-6${
            partySettings.isDiscountVisible ? "" : " is-invisible"
          }`}
        />
        <span
          className={`is-size-6${
            partySettings.isEquallyVisible ? "" : " is-invisible"
          }`}
        />
        {party.users?.length > 0 ? (
          party.users.map((user) => (
            <span
              key={user.id}
              className={`${sumClassName} ${
                user.id === currentUser.id ? " has-text-info" : ""
              }${shouldRotate ? " rotated-text" : ""}`}
              // title={`Open detailed view for ${user.name}`}
              // onClick={() => {
              //   setValue("user", user);
              //   setValue("view", "user");
              // }}
            >
              {getPartyUserBaseTotal(party.items, user.id).toFixed(2)}
            </span>
          ))
        ) : (
          <div />
        )}
      </PartyFormLayout>
      <PartyFormLayout
        isDiscountVisible={partySettings.isDiscountVisible}
        isEquallyVisible={partySettings.isEquallyVisible}
        amountOfUsers={party.users.length}
      >
        <span className="is-size-6 has-text-right">Discount</span>
        <span className={sumClassName} />
        <span className={sumClassName}>{Number(discount || 0).toFixed(2)}</span>

        <span
          className={`${sumClassName}${
            partySettings.isDiscountVisible ? "" : " is-invisible"
          }`}
        >
          {totalDiscount.toFixed(2)}
        </span>
        <span
          className={`${sumClassName}${
            partySettings.isEquallyVisible ? "" : " is-invisible"
          }`}
        />
        {party.users?.length > 0 ? (
          party.users.map((user) => (
            <span
              key={user.id}
              className={`${sumClassName} ${
                user.id === currentUser.id ? " has-text-info" : ""
              }${shouldRotate ? " rotated-text" : ""}`}
              // title={`Open detailed view for ${user.name}`}
              // onClick={() => {
              //   setValue("user", user);
              //   setValue("view", "user");
              // }}
            >
              {(
                getPartyUserDiscount(party.items, user.id) +
                getPartyUserBaseTotal(party.items, user.id) *
                  (partySettings.discountPercent || 0) *
                  0.01
              ).toFixed(2)}
            </span>
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
      >
        <span className="is-size-6 has-text-right">Total</span>
        <span className={sumClassName} />
        <span className={sumClassName}>
          {Number(getPartyTotal(party.items) - (discount || 0)).toFixed(2)}
        </span>

        <span
          className={`${sumClassName}${
            partySettings.isDiscountVisible ? "" : " is-invisible"
          }`}
        >
          {Number(totalDiscount + (discount || 0)).toFixed(2)}
        </span>
        <span
          className={`${sumClassName}${
            partySettings.isEquallyVisible ? "" : " is-invisible"
          }`}
        />
        {party.users?.length > 0 ? (
          party.users.map((user) => {
            const baseTotal = getPartyUserBaseTotal(party.items, user.id);
            const discount =
              getPartyUserDiscount(party.items, user.id) +
              baseTotal * (partySettings.discountPercent || 0) * 0.01;
            return (
              <span
                key={user.id}
                className={`${sumClassName} ${
                  user.id === currentUser.id ? " has-text-info" : ""
                }${shouldRotate ? " rotated-text" : ""}`}
                // title={`Open detailed view for ${user.name}`}
                // onClick={() => {
                //   setValue("user", user);
                //   setValue("view", "user");
                // }}
              >
                {(baseTotal - discount).toFixed(2)}
              </span>
            );
          })
        ) : (
          <div />
        )}
      </PartyFormLayout>
    </Block>
  );
};

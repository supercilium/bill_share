import { FC } from "react";
import cx from "classnames";
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
import { useTranslation } from "react-i18next";

export const PartyTotals: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
  partySettings: FormSettings;
}> = ({ party, currentUser, partySettings }) => {
  const { t } = useTranslation();
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
        amountOfUsers={Object.keys(party.users).length}
      >
        <span className="is-size-6 has-text-right">{t("TOTAL_BASE")}</span>
        <span className="is-size-6" />
        <span className={sumClassName}>{baseTotal}</span>
        <span
          className={cx("is-size-6", {
            "is-invisible": !partySettings.isDiscountVisible,
          })}
        />
        <span
          className={cx("is-size-6", {
            "is-invisible": !partySettings.isEquallyVisible,
          })}
        />
        {party.users ? (
          Object.keys(party.users).map((id) => (
            <span
              key={id}
              className={cx(sumClassName, {
                "has-text-info": id === currentUser.id,
                "rotated-text": shouldRotate,
              })}
              // title={`Open detailed view for ${user.name}`}
              // onClick={() => {
              //   setValue("user", user);
              //   setValue("view", "user");
              // }}
            >
              {getPartyUserBaseTotal(party.items, id).toFixed(2)}
            </span>
          ))
        ) : (
          <div />
        )}
      </PartyFormLayout>
      <PartyFormLayout
        isDiscountVisible={partySettings.isDiscountVisible}
        isEquallyVisible={partySettings.isEquallyVisible}
        amountOfUsers={Object.keys(party.users).length}
      >
        <span className="is-size-6 has-text-right">{t("DISCOUNT")}</span>
        <span className={sumClassName} />
        <span className={sumClassName}>{Number(discount || 0).toFixed(2)}</span>

        <span
          className={cx(sumClassName, {
            "is-invisible": !partySettings.isDiscountVisible,
          })}
        >
          {totalDiscount.toFixed(2)}
        </span>
        <span
          className={cx(sumClassName, {
            "is-invisible": !partySettings.isEquallyVisible,
          })}
        />
        {party.users ? (
          Object.keys(party.users).map((id) => (
            <span
              key={id}
              className={cx(sumClassName, {
                "has-text-info": id === currentUser.id,
                "rotated-text": shouldRotate,
              })}
              // title={`Open detailed view for ${user.name}`}
              // onClick={() => {
              //   setValue("user", user);
              //   setValue("view", "user");
              // }}
            >
              {(
                getPartyUserDiscount(party.items, id) +
                getPartyUserBaseTotal(party.items, id) *
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
        amountOfUsers={Object.keys(party.users).length}
      >
        <span className="is-size-6 has-text-right">{t("TOTAL")}</span>
        <span className={sumClassName} />
        <span className={sumClassName}>
          {Number(getPartyTotal(party.items) - (discount || 0)).toFixed(2)}
        </span>

        <span
          className={cx(sumClassName, {
            "is-invisible": !partySettings.isDiscountVisible,
          })}
        >
          {Number(totalDiscount + (discount || 0)).toFixed(2)}
        </span>
        <span
          className={cx(sumClassName, {
            "is-invisible": !partySettings.isEquallyVisible,
          })}
        />
        {party.users ? (
          Object.keys(party.users).map((id) => {
            const baseTotal = getPartyUserBaseTotal(party.items, id);
            const discount =
              getPartyUserDiscount(party.items, id) +
              baseTotal * (partySettings.discountPercent || 0) * 0.01;
            return (
              <span
                key={id}
                className={cx(sumClassName, {
                  "has-text-info": id === currentUser.id,
                  "rotated-text": shouldRotate,
                })}
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Block, Columns, Field } from "../../components";
import { FormSettings } from "../../contexts/PartySettingsContext";
import {
  IS_PARTY_HINTS_HIDDEN,
  useUISettings,
} from "../../contexts/UIsettings";
import { PartyInterface } from "../../types/party";
import { Transport } from "../../services/transport";
import { AddUserForm } from "../AddUserForm";
import { SettingsRoot } from "./PartySettings.styles";

export const PartySettings: FC<{ party: PartyInterface }> = ({ party }) => {
  const handlers = useFormContext<FormSettings>();
  const { areHintsVisible, setHintsVisibility, setAsideVisibility } =
    useUISettings();

  const total = handlers.watch("total");
  const isPercentage = handlers.watch("isPercentage");
  const discountHandlers = handlers.register("discount", { max: total });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAsideVisibility(false);
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateDiscount = async () => {
    Transport.sendEvent({
      type: "update discount",
      partyId: party.id,
      discount: handlers.getValues("discount") || 0,
      isPercentage: handlers.getValues("isPercentage"),
    });
  };
  const handleRemoveUser = (userId: string) => {
    Transport.sendEvent({ type: "remove user", userId, partyId: party.id });
  };

  const header = (
    <div className="is-flex is-justify-content-space-between">
      <div className="is-flex is-align-items-baseline">
        <span className="mr-5">Party settings</span>
        <Field
          label=" Show hints"
          inputProps={{
            type: "checkbox",
            checked: areHintsVisible,
            onChange: (e) => {
              if (!e.target.checked) {
                localStorage.setItem(IS_PARTY_HINTS_HIDDEN, "HIDDEN");
              } else {
                localStorage.removeItem(IS_PARTY_HINTS_HIDDEN);
              }
              setHintsVisibility(e.target.checked);
              return Promise.resolve(false);
            },
          }}
        />
      </div>
      <button
        className="button icon"
        onClick={() => setAsideVisibility((prev) => !prev)}
        aria-label="close"
      >
        <FontAwesomeIcon icon="xmark" />
      </button>
    </div>
  );

  return (
    <SettingsRoot className="box">
      <Block title={header}>
        <Columns>
          <div>
            <Block>
              <p className="has-text-grey-dark is-size-5 mb-3">
                Visibility settings
              </p>
              {areHintsVisible && (
                <article className="message">
                  <div className="message-body">
                    We hid unimportant columns, because the form already has a
                    lot of staff and we do not have a designer to make it fits
                    the screen (at least for now). So you can choose to show
                    discount and is shared columns here.
                  </div>
                </article>
              )}

              <Field
                label=" Show discount column for items (D)"
                inputProps={{
                  type: "checkbox",
                  ...handlers.register("isDiscountVisible"),
                }}
              />
              <Field
                label=" Show «Is shared» column (S)"
                inputProps={{
                  type: "checkbox",
                  ...handlers.register("isEquallyVisible"),
                }}
              />

              {areHintsVisible && (
                <article className="message">
                  <div className="message-body">
                    Is shared - means items will shared between all participants
                    (guys with checked checkboxes), in the other way you will
                    have an opportunity to write amounts of items to each
                    member.
                  </div>
                </article>
              )}
            </Block>
            <Block>
              <p className="has-text-grey-dark is-size-5 mb-3">Switch view</p>
              {areHintsVisible && (
                <article className="message">
                  <div className="message-body">
                    You can switch view to see full party with all participants
                    and tons of checkboxes or only your items. Clicking on
                    member's name or totals will switch the form to that
                    member's view. Press U/P keys to switch between them.
                  </div>
                </article>
              )}

              <Field
                labels={[" User (U)", " Full party (P)"]}
                inputProps={{
                  type: "radio",
                  value: ["user", "party"],
                  ...handlers.register("view"),
                }}
              />
            </Block>
          </div>
          <div className="ml-6">
            <Block>
              <AddUserForm />
            </Block>
            {party.users.length > 0 ? (
              <Block>
                <p className="has-text-grey-dark is-size-5 mb-3">
                  Already in da club
                </p>
                {party.users.map((user) => (
                  <p
                    key={user.id}
                    className="is-size-4 is-flex is-align-items-center"
                  >
                    {user.name}{" "}
                    {user.id !== party.owner.id ? (
                      <button
                        type="button"
                        className="delete ml-2"
                        onClick={() => handleRemoveUser(user.id)}
                      ></button>
                    ) : (
                      <span
                        className="ml-2 icon has-text-grey-light"
                        title="Master of the party"
                      >
                        <FontAwesomeIcon icon="crown" />
                      </span>
                    )}
                  </p>
                ))}
              </Block>
            ) : null}
          </div>
        </Columns>
        <Columns
          columnProps={{ className: "is-two-thirds" }}
          containerProps={{ className: "mb-0" }}
        >
          <div>
            <p className="has-text-grey-dark is-size-5 mb-0">
              Discounts and tips
            </p>
            {areHintsVisible && (
              <article className="message">
                <div className="message-body">
                  You can add discount for any item by switching on discount
                  column or by putting discount for full bill here. In
                  percentage or absolute amount - these fields are calculated
                  depending on total sum of your bill. All discounts (item's and
                  for full bill) will be summarized.
                </div>
              </article>
            )}
          </div>
        </Columns>
        <Columns columnProps={{ className: "is-narrow" }}>
          <div>
            <label htmlFor="discount" className="label">
              Discount {isPercentage ? "(%)" : "(absolute amount)"}
            </label>
            <div className="field has-addons">
              <div className="control is-flex-grow-1">
                <input
                  id="discount"
                  className={
                    handlers.formState.errors.discount
                      ? "input is-danger"
                      : "input"
                  }
                  type="number"
                  placeholder="0"
                  min={0}
                  max={total}
                  {...discountHandlers}
                />
              </div>
              <div className="control">
                <button
                  disabled={!!handlers.formState.errors.discount}
                  onClick={() => {
                    const values = handlers.getValues();
                    let { discountPercent, discount, isPercentage } = values;
                    if (total && !handlers.formState.errors.discount) {
                      discountPercent = isPercentage
                        ? discount
                        : Number(
                            (((discount || 0) * 100) / +total).toFixed(13)
                          );
                      handlers.setValue("discountPercent", discountPercent);
                    }

                    return handleUpdateDiscount();
                  }}
                  className="button is-info"
                >
                  <FontAwesomeIcon icon="check" />
                </button>
              </div>
            </div>
            <Field
              label=" Discount is in percentage"
              inputProps={{
                type: "checkbox",
                ...handlers.register("isPercentage"),
              }}
            />
          </div>
        </Columns>
      </Block>
    </SettingsRoot>
  );
};

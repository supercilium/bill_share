import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Block, Columns, Field } from "../../components";
import {
  IS_PARTY_HINTS_HIDDEN,
  useUISettings,
} from "../../contexts/UIsettings";
import { useDebounce } from "../../hooks/useDebounce";
import { PartyInterface } from "../../types/party";
import { sendEvent } from "../../utils/eventHandlers";
import { socketClient } from "../../__api__/socket";
import { AddUserForm } from "../AddUserForm";

export const PartySettings: FC<{ party: PartyInterface }> = ({ party }) => {
  const handlers = useFormContext();
  const { areHintsVisible, setHintsVisibility, setAsideVisibility } =
    useUISettings();

  const discountPercentHandlers = handlers.register("discountPercent");
  const discountHandlers = handlers.register("discount");
  const total = handlers.watch("total");
  const discountPercent = handlers.watch("discountPercent", 0);
  const debouncedDiscount = useDebounce<number>(+discountPercent, 500);

  useEffect(() => {
    if ((debouncedDiscount + "").length > 0 && socketClient.connected) {
      handleUpdateDiscount(debouncedDiscount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDiscount]);

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

  const handleUpdateDiscount = async (discount: number) => {
    sendEvent({
      type: "update discount",
      partyId: party.id,
      discount,
    });
  };
  const handleRemoveUser = (userId: string) => {
    sendEvent({ type: "remove user", userId, partyId: party.id });
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
    <div className="box">
      <Block title={header}>
        <Columns>
          <Block>
            <p className="has-text-grey-dark is-size-5 mb-3">
              Visibility settings
            </p>
            {areHintsVisible && (
              <article className="message">
                <div className="message-body">
                  We hid unimportant columns, because the form already has a lot
                  of staff and we do not have a designer to make it fits the
                  screen (at least for now). So you can choose to show discount
                  and is shared columns here.
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
                  (guys with checked checkboxes), in the other way you will have
                  an opportunity to write amounts of items to each member.
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
                  member's name or totals will switch the form to that member's
                  view. Press U/P keys to switch between them.
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
          <div>
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
        <div className="columns">
          <div className="column is-two-thirds">
            <Block>
              <p className="has-text-grey-dark is-size-5 mb-3">
                Discounts and tips
              </p>
              {areHintsVisible && (
                <article className="message">
                  <div className="message-body">
                    You can add discount for any item by switching on discount
                    column or by putting discount for full bill here. In
                    percentage or absolute amount - these fields are calculated
                    depending on total sum of your bill. All discounts (item's
                    and for full bill) will be summarized.
                  </div>
                </article>
              )}

              <Field
                label="Full party discount (absolute value)"
                inputProps={{
                  type: "number",
                  min: 0,
                  max: total,
                  style: { maxWidth: "10rem" },
                  ...discountHandlers,
                  onChange: (e) => {
                    if (total) {
                      handlers.setValue(
                        "discountPercent",
                        Number(((+e.target.value * 100) / +total).toFixed(13))
                      );
                    }

                    return discountHandlers.onChange(e);
                  },
                }}
              />
              <Field
                label="Full party discount (percent)"
                inputProps={{
                  type: "number",
                  min: 0,
                  max: 100,
                  step: 5,
                  style: { maxWidth: "10rem" },
                  ...discountPercentHandlers,
                  onChange: (e) => {
                    if (total) {
                      handlers.setValue(
                        "discount",
                        Number((+e.target.value * +total * 0.01).toFixed(2))
                      );
                    }
                    return discountPercentHandlers.onChange(e);
                  },
                }}
              />
            </Block>
          </div>
        </div>
      </Block>
    </div>
  );
};

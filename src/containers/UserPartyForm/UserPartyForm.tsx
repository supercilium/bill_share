import React, { FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Block, Columns, Field } from "../../components";
import { PartyInterface } from "../../types/party";
import { useParams } from "react-router";
import { Item } from "../../types/item";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { EmptyPartyLayout } from "../../layouts/emptyParty";
import {
  getPartyUserBaseTotal,
  getPartyUserDiscount,
  splitItems,
} from "../../utils/calculation";
import { User } from "../../types/user";
import { PartyHeader } from "../PartyHeader";
import { useParty } from "../../hooks/useParty";
import { Transport } from "../../services/transport";
import { UserFormLayout } from "../../components/UserFormLayout";
import "./UserPartyForm.scss";

const DISCOUNT_COL_WIDTH = "85px";

export const UserPartyForm: FC<{
  party: PartyInterface;
  user: User;
}> = ({ party, user }) => {
  const { partyId } = useParams();
  const handlers = useParty({ party });
  const { register, formState } = handlers;
  const { isValid, errors } = formState;
  const { watch } = useFormContext<FormSettings>();
  const partySettings = watch();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      (document.querySelector(":root") as HTMLElement)?.style?.setProperty(
        "--discount-column-user",
        partySettings.isDiscountVisible ? DISCOUNT_COL_WIDTH : "0"
      );
    });
  }, [partySettings.isDiscountVisible]);

  if (!partyId) {
    return <EmptyPartyLayout />;
  }
  const userId = user.id;
  const [userItems, restItems] = splitItems(party.items, userId);

  const handleRemoveItemFromUser = (id: string) => {
    Transport.sendEvent({
      type: "remove user item",
      userId,
      partyId,
      itemId: id,
    });
  };

  const handleChangeUserInItem = (item: Item) => {
    if (item.equally) {
      Transport.sendEvent({
        type: "add user item",
        userId,
        partyId,
        itemId: item.id,
      });
    } else {
      Transport.sendEvent({
        type: "update user item",
        userId,
        partyId,
        value: 1,
        itemId: item.id,
      });
    }
  };

  const handleChangeItem = async (
    data: Partial<Omit<Item, "id" | "users">> & { itemId: string }
  ) => {
    Transport.sendEvent({
      type: "update item",
      userId,
      partyId,
      ...data,
    });
  };
  const handleUpdateUserItem = async (data: {
    itemId: string;
    value: number;
  }) => {
    Transport.sendEvent({
      type: "update user item",
      userId,
      partyId,
      ...data,
    });
  };
  const total = getPartyUserBaseTotal(userItems, userId);
  const discount =
    getPartyUserDiscount(userItems, userId) +
    total * (partySettings.discountPercent || 0) * 0.01;

  return (
    <Block title={<PartyHeader users={party.users} master={party.owner} />}>
      {!party.items?.length ? (
        <EmptyPartyLayout />
      ) : (
        <form key={userId} noValidate={true}>
          <Columns containerProps={{ className: "is-flex-wrap-wrap" }}>
            <div className="is-translated">
              <div className="box with-scroll-horizontal mt-4">
                {userItems.length ? (
                  <>
                    <p className="is-size-5-touch is-size-4-desktop">
                      In your bill
                    </p>
                    <UserFormLayout>
                      <span className="is-size-6">Item name</span>
                      <span className="is-size-6">Amount</span>
                      <span className="is-size-6">Price</span>
                      <span
                        className={`is-size-6${
                          partySettings.isDiscountVisible ? "" : " is-invisible"
                        }`}
                      >
                        Discount
                        <span className="is-size-7 has-text-grey ml-1">
                          (%)
                        </span>
                      </span>

                      <span />
                    </UserFormLayout>

                    {userItems.map((item, i) => {
                      return (
                        <React.Fragment key={item.id}>
                          <UserFormLayout className="my-3">
                            <span className="is-size-5-touch is-size-4-desktop is-flex is-align-items-center">
                              <button
                                type="button"
                                className="delete mr-2"
                                title="Remove item from my bill"
                                onClick={() =>
                                  handleRemoveItemFromUser(item.id)
                                }
                              />
                              <Field
                                error={errors.items?.[i]?.name}
                                inputProps={{
                                  type: "text",
                                  ...register(
                                    `items.${item.originalIndex}.name`
                                  ),
                                  onBlur: ({ target }) => {
                                    if (
                                      target.value === item.name ||
                                      !isValid
                                    ) {
                                      return new Promise(() => {});
                                    }
                                    return handleChangeItem({
                                      itemId: item.id,
                                      name: target.value,
                                    });
                                  },
                                }}
                              />
                            </span>
                            <span className="is-size-5-touch is-size-4-desktop">
                              {!item.equally ? (
                                <Field
                                  error={
                                    errors.items?.[item.originalIndex]?.users?.[
                                      userId
                                    ]?.value
                                  }
                                  inputProps={{
                                    type: "number",
                                    min: 0,
                                    ...register(
                                      `items.${item.originalIndex}.users.${userId}.value`
                                    ),
                                    onBlur: ({ target }) => {
                                      if (
                                        +target.value ===
                                          item.users[userId].value ||
                                        !isValid
                                      ) {
                                        return new Promise(() => {});
                                      }

                                      return handleUpdateUserItem({
                                        itemId: item.id,
                                        value: +target.value,
                                      });
                                    },
                                  }}
                                />
                              ) : (
                                <span className="has-text-grey-light is-size-6">
                                  {`${item.amount}${
                                    item.participants > 1
                                      ? ` / ${item.participants}`
                                      : ""
                                  }`}
                                </span>
                              )}
                            </span>
                            <span className="is-size-5-touch is-size-4-desktop">
                              <Field
                                error={errors.items?.[i]?.price}
                                inputProps={{
                                  type: "number",
                                  min: 0,
                                  ...register(
                                    `items.${item.originalIndex}.price`
                                  ),
                                  onBlur: ({ target }) => {
                                    if (
                                      +target.value === item.price ||
                                      !isValid
                                    ) {
                                      return new Promise(() => {});
                                    }

                                    return handleChangeItem({
                                      itemId: item.id,
                                      price: +target.value,
                                    });
                                  },
                                }}
                              />
                            </span>
                            <span
                              className={`is-size-5-touch is-size-4-desktop${
                                partySettings.isDiscountVisible
                                  ? ""
                                  : " is-invisible"
                              }`}
                            >
                              <Field
                                error={errors.items?.[i]?.discount}
                                inputProps={{
                                  type: "number",
                                  step: 5,
                                  min: 0,
                                  max: 100,
                                  ...register(
                                    `items.${item.originalIndex}.discount`
                                  ),
                                  onBlur: ({ target }) => {
                                    if (
                                      +target.value === item.discount ||
                                      !isValid
                                    ) {
                                      return new Promise(() => {});
                                    }

                                    return handleChangeItem({
                                      itemId: item.id,
                                      discount: +target.value,
                                    });
                                  },
                                }}
                              />
                            </span>
                            <span className="price-per-row is-size-6 has-text-primary-dark">
                              {item.total.toFixed(2)}
                            </span>
                          </UserFormLayout>
                          {partySettings.isEquallyVisible && (
                            <Field
                              label=" Calculate item equally"
                              inputProps={{
                                type: "checkbox",
                                ...register(
                                  `items.${item.originalIndex}.equally`
                                ),
                                onChange: ({ target }) =>
                                  handleChangeItem({
                                    itemId: item.id,
                                    equally: target.checked,
                                  }),
                              }}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                    {discount ? (
                      <>
                        <p className="is-size-6 mt-2 has-text-grey has-text-right">
                          Base cost: {total.toFixed(2)}
                        </p>
                        <p className="is-size-6 mt-2 has-text-grey has-text-right">
                          Discount: {discount.toFixed(2)}
                        </p>
                        <hr className="my-3" />
                        <p className="is-size-5 mt-2 has-text-primary-dark has-text-right">
                          Total: {(total - discount).toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="is-size-5 mt-2 has-text-primary-dark has-text-right">
                        Total: {total.toFixed(2)}
                      </p>
                    )}
                  </>
                ) : (
                  <EmptyPartyLayout />
                )}
              </div>
            </div>
            <div className="is-translated">
              {restItems.length > 0 && (
                <div className="box with-scroll-horizontal mt-4">
                  <p className="is-size-4">More items from party</p>
                  <UserFormLayout>
                    <span className="is-size-6">Item name</span>
                    <span className="is-size-6">Amount</span>
                    <span className="is-size-6">Price</span>
                  </UserFormLayout>
                  {restItems.map((item) => (
                    <div
                      key={item.id}
                      className={
                        item.isMuted ? "has-text-grey" : "is-clickable"
                      }
                      onClick={() =>
                        !item.isMuted && handleChangeUserInItem(item)
                      }
                      title={
                        item.isMuted
                          ? "Already in my bill"
                          : `Add ${item.name} to my bill`
                      }
                    >
                      <UserFormLayout className="my-3" key={item.id}>
                        <span className="text-overflow-hidden is-size-5">
                          {item.name}
                        </span>
                        <span className="is-size-5">{item.amount}</span>
                        <span className="is-size-5">{item.price}</span>
                      </UserFormLayout>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Columns>
        </form>
      )}
    </Block>
  );
};

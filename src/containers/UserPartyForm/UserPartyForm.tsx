import React, { FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import cx from "classnames";
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
import { useTranslation } from "react-i18next";

const DISCOUNT_COL_WIDTH = "85px";
const AMOUNT_COL_WIDTH = "110px";

export const UserPartyForm: FC<{
  party: PartyInterface;
  user: User;
  isReadOnly?: boolean;
}> = ({ party, user, isReadOnly = true }) => {
  const { partyId } = useParams();
  const handlers = useParty({ party });
  const { register, formState, watch: watchParty } = handlers;
  const { isValid, errors } = formState;
  const { watch } = useFormContext<FormSettings>();
  const partySettings = watch();
  const currentUser = JSON.parse(localStorage.getItem("user") ?? "{}") || {};
  const { t } = useTranslation();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      (document.querySelector(":root") as HTMLElement)?.style?.setProperty(
        "--discount-column-user",
        partySettings.isDiscountVisible ? DISCOUNT_COL_WIDTH : "0"
      );
    });
  }, [partySettings.isDiscountVisible]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      (document.querySelector(":root") as HTMLElement)?.style?.setProperty(
        "--amount-column-user",
        party.items?.some((item) => !item.equally) ? AMOUNT_COL_WIDTH : "65px"
      );
    });
  }, [party]);

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
      currentUser: currentUser.id,
    });
  };

  const handleChangeUserInItem = (item: Item) => {
    if (item.equally) {
      Transport.sendEvent({
        type: "add user item",
        userId,
        partyId,
        itemId: item.id,
        currentUser: currentUser.id,
      });
    } else {
      Transport.sendEvent({
        type: "update user item",
        userId,
        partyId,
        value: 1,
        itemId: item.id,
        currentUser: currentUser.id,
      });
    }
  };

  const handleChangeItem = async (
    data: Partial<Omit<Item, "id" | "users">> & { itemId: string }
  ) => {
    if (!isValid) {
      return;
    }
    Transport.sendEvent({
      type: "update item",
      userId,
      partyId,
      currentUser: currentUser.id,
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
      currentUser: currentUser.id,
      ...data,
    });
  };
  const total = getPartyUserBaseTotal(userItems, userId);
  const discount =
    getPartyUserDiscount(userItems, userId) +
    total * (partySettings.discountPercent ?? 0) * 0.01;

  return (
    <Block
      title={
        <PartyHeader
          isReadOnly={isReadOnly}
          users={party.users}
          master={party.owner}
        />
      }
    >
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
                      {t("IN_YOUR_BILL")}
                    </p>
                    <UserFormLayout>
                      <span className="is-size-6">{t("ITEM_NAME")}</span>
                      <span className="is-size-6">{t("AMOUNT")}</span>
                      <span className="is-size-6">{t("PRICE")}</span>
                      <span
                        className={cx("is-size-6", {
                          "is-invisible": !partySettings.isDiscountVisible,
                        })}
                      >
                        {t("DISCOUNT")}
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
                                title={t("BUTTON_REMOVE_FROM_MY_BILL")}
                                disabled={isReadOnly}
                                onClick={() =>
                                  handleRemoveItemFromUser(item.id)
                                }
                              />
                              <Field
                                error={errors.items?.[i]?.name}
                                onEnter={() => {
                                  if (isReadOnly) {
                                    return;
                                  }
                                  const value = watchParty(
                                    `items.${item.originalIndex}.name`
                                  );
                                  if (value === item.name) {
                                    return;
                                  }
                                  handleChangeItem({
                                    itemId: item.id,
                                    name: value,
                                  });
                                }}
                                inputProps={{
                                  type: "text",
                                  disabled: isReadOnly,
                                  ...register(
                                    `items.${item.originalIndex}.name`
                                  ),
                                  onBlur: ({ target }) => {
                                    if (target.value === item.name) {
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
                                <span className="is-flex is-align-items-center">
                                  <div>
                                    <Field
                                      error={
                                        errors.items?.[item.originalIndex]
                                          ?.users?.[userId]?.value
                                      }
                                      onEnter={() => {
                                        const value = +watchParty(
                                          `items.${item.originalIndex}.users.${userId}.value`
                                        );
                                        if (
                                          item.users[userId].value === value
                                        ) {
                                          return;
                                        }
                                        handleUpdateUserItem({
                                          itemId: item.id,
                                          value: value,
                                        });
                                      }}
                                      inputProps={{
                                        disabled: isReadOnly,
                                        type: "number",
                                        min: 0,
                                        ...register(
                                          `items.${item.originalIndex}.users.${userId}.value`
                                        ),
                                        onBlur: ({ target }) => {
                                          if (
                                            +target.value ===
                                            item.users[userId].value
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
                                  </div>
                                  <button
                                    type="button"
                                    className="button ml-2 is-primary is-small is-rounded pl-2 pr-2"
                                    title={t("BUTTON_ONE_MORE")}
                                    disabled={isReadOnly}
                                    onClick={() =>
                                      handleUpdateUserItem({
                                        itemId: item.id,
                                        value:
                                          (item.users[userId].value ?? 0) + 1,
                                      })
                                    }
                                  >
                                    +1
                                  </button>
                                </span>
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
                                onEnter={() => {
                                  const value = +watchParty(
                                    `items.${item.originalIndex}.price`
                                  );
                                  if (value === item.price) {
                                    return;
                                  }
                                  handleChangeItem({
                                    itemId: item.id,
                                    price: value,
                                  });
                                }}
                                inputProps={{
                                  type: "number",
                                  disabled: isReadOnly,
                                  min: 0,
                                  ...register(
                                    `items.${item.originalIndex}.price`
                                  ),
                                  onBlur: ({ target }) => {
                                    if (+target.value === item.price) {
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
                              className={cx(
                                "is-size-5-touch is-size-4-desktop",
                                {
                                  "is-invisible":
                                    !partySettings.isDiscountVisible,
                                }
                              )}
                            >
                              <Field
                                error={errors.items?.[i]?.discount}
                                onEnter={() => {
                                  const value = +(
                                    watchParty(
                                      `items.${item.originalIndex}.discount`
                                    ) ?? 0
                                  );
                                  if (value === item.discount) {
                                    return;
                                  }
                                  handleChangeItem({
                                    itemId: item.id,
                                    discount: value,
                                  });
                                }}
                                inputProps={{
                                  type: "number",
                                  disabled: isReadOnly,
                                  step: 5,
                                  min: 0,
                                  max: 100,
                                  ...register(
                                    `items.${item.originalIndex}.discount`
                                  ),
                                  onBlur: ({ target }) => {
                                    if (+target.value === item.discount) {
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
                              label={t("LABEL_SHARE_FOR_ALL")}
                              inputProps={{
                                disabled: isReadOnly,
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
                          {t("TOTAL_BASE")}: {total.toFixed(2)}
                        </p>
                        <p className="is-size-6 mt-2 has-text-grey has-text-right">
                          {t("DISCOUNT")}: {discount.toFixed(2)}
                        </p>
                        <hr className="my-3" />
                        <p className="is-size-5 mt-2 has-text-primary-dark has-text-right">
                          {t("TOTAL")}: {(total - discount).toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="is-size-5 mt-2 has-text-primary-dark has-text-right">
                        {t("TOTAL")}: {total.toFixed(2)}
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
                  <p className="is-size-4">{t("MORE_ITEMS")}</p>
                  <UserFormLayout>
                    <span className="is-size-6">{t("ITEM_NAME")}</span>
                    <span className="is-size-6">{t("AMOUNT")}</span>
                    <span className="is-size-6">{t("PRICE")}</span>
                  </UserFormLayout>
                  {restItems.map((item) => (
                    <div
                      key={item.id}
                      className={cx({
                        "has-text-grey": item.isMuted,
                        "is-clickable": !item.isMuted && !isReadOnly,
                      })}
                      onClick={() =>
                        !isReadOnly &&
                        !item.isMuted &&
                        handleChangeUserInItem(item)
                      }
                      title={
                        item.isMuted
                          ? t("ALREADY_IN_BILL")
                          : t("ADD_TO_BILL", { name: item.name })
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

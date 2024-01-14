import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router";
import cx from "classnames";
import { Block, Field } from "../../components";
import { Item } from "../../types/item";
import { PartyInterface } from "../../types/party";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { EmptyPartyLayout } from "../../layouts/emptyParty";
import { Transport } from "../../services/transport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParty } from "../../hooks/useParty";
import { PartyFormLayout } from "../../components/PartyFormLayout";
import "./PartyForm.scss";
import { useTranslation } from "react-i18next";
import { usePartySettingsContext } from "../../contexts/PartyModalContext";
import { ItemDetails } from "../ItemDetails";

export const PartyForm: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
  isReadOnly: boolean;
}> = ({ party, currentUser, isReadOnly }) => {
  const { users } = party;
  const { partyId } = useParams();
  const handlers = useParty({ party });
  const { register, formState, watch: watchParty } = handlers;
  const { isValid, errors } = formState;
  const { watch, setValue } = useFormContext<FormSettings>();
  const partySettings = watch();
  const { t } = useTranslation();
  const { setAddItemModalVisibility } = usePartySettingsContext();
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  if (!party.items.length || !partyId) {
    return (
      <EmptyPartyLayout>
        <button
          type="button"
          className="button is-primary ml-4"
          onClick={() => setAddItemModalVisibility(true)}
        >
          {t("TITLE_ADD_ITEM")}
        </button>
      </EmptyPartyLayout>
    );
  }
  const handleChangeItem = async ({
    id,
    ...data
  }: Partial<Omit<Item, "users">>) => {
    if (!isValid) {
      return;
    }
    Transport.sendEvent({
      type: "update item",
      userId: currentUser.id,
      currentUser: currentUser.id,
      partyId,
      itemId: id as string,
      ...data,
    });
  };
  const handleChangeUserInItem = async (
    shouldAddUser: boolean,
    userId: string,
    itemId: string
  ) => {
    Transport.sendEvent({
      type: shouldAddUser ? "add user item" : "remove user item",
      currentUser: currentUser.id,
      userId,
      partyId,
      itemId,
    });
  };
  const handleRemoveItem = (id: string) => {
    Transport.sendEvent({
      type: "remove item",
      userId: currentUser.id,
      currentUser: currentUser.id,
      partyId,
      itemId: id,
    });
  };
  const handleUpdateUserItem = async (data: {
    itemId: string;
    value: number;
    userId: string;
  }) => {
    Transport.sendEvent({
      type: "update user item",
      currentUser: currentUser.id,
      partyId,
      ...data,
    });
  };

  const partyLayoutProps: Omit<
    React.ComponentProps<typeof PartyFormLayout>,
    "children"
  > = {
    amountOfUsers: Object.keys(users).length,
    isDiscountVisible: partySettings.isDiscountVisible,
    isEquallyVisible: partySettings.isEquallyVisible,
  };

  return (
    <>
      <Block
        title={
          <div className="is-flex is-align-items-center">
            <p>{t("TITLE_FULL_BILL")}</p>
            <button
              type="button"
              className="button ml-2"
              onClick={() => setAddItemModalVisibility(true)}
            >
              {t("TITLE_ADD_ITEM")}
            </button>
          </div>
        }
      >
        <PartyFormLayout {...partyLayoutProps}>
          <span className="is-size-6">{t("ITEM_NAME")}</span>
          <span className="is-size-6">{t("AMOUNT")}</span>
          <span className="is-size-6">{t("PRICE")}</span>
          <span
            className={`is-size-6${
              partySettings.isDiscountVisible ? "" : " is-invisible"
            }`}
          >
            {t("DISCOUNT")}
            <span className="is-size-7 has-text-grey ml-1">(%)</span>
          </span>
          <span
            className={cx("is-size-6", {
              "is-invisible": !partySettings.isEquallyVisible,
            })}
          >
            {t("IS_SHARED")}
          </span>
          {users ? (
            Object.values(users).map((user) => {
              const isCurrentUser = user.id === currentUser.id;
              return (
                <div className="user-column-title" key={user.id}>
                  <span
                    className={cx(
                      "is-size-6 text-overflow-hidden is-clickable",
                      {
                        "has-text-info": isCurrentUser,
                      }
                    )}
                    title={t("BUTTON_OPEN_USERS_DETAILS", { name: user.name })}
                    onClick={() => {
                      if (isReadOnly) {
                        return;
                      }
                      setValue("user", user);
                      setValue("view", "user");
                    }}
                  >
                    {user.name}
                  </span>
                  {user.id === party.owner.id && (
                    <i>
                      <FontAwesomeIcon
                        className={cx({ "has-text-info": isCurrentUser })}
                        icon="crown"
                        size="2xs"
                        title={t("PARTY_MASTER")}
                      />
                    </i>
                  )}
                </div>
              );
            })
          ) : (
            <div />
          )}
        </PartyFormLayout>

        <form noValidate={true}>
          {party.items.map((itemProps, i) => {
            const { users: itemUsers, ...item } = itemProps;
            return (
              <PartyFormLayout
                {...partyLayoutProps}
                className="my-3"
                key={item.id}
              >
                <div className="is-size-4 is-flex ">
                  <div className="delete-root">
                    <button
                      type="button"
                      className="delete mr-2"
                      title={t("BUTTON_REMOVE_ITEM")}
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isReadOnly}
                    />
                  </div>

                  <button
                    onClick={() => setEditingItem(itemProps)}
                    type="button"
                    className="button is-ghost text-overflow-hidden"
                  >
                    {item.name}
                  </button>
                </div>
                <span className="is-size-4">
                  <Field
                    error={errors.items?.[i]?.amount}
                    onEnter={() => {
                      const amount = watchParty(`items.${i}.amount`);
                      if (amount === item.amount || isReadOnly) {
                        return;
                      }
                      handleChangeItem({
                        id: item.id,
                        amount,
                      });
                    }}
                    inputProps={{
                      type: "number",
                      disabled: isReadOnly,
                      min: 1,
                      ...register(`items.${i}.amount`),
                      onBlur: ({ target }) => {
                        if (+target.value === item.amount) {
                          return new Promise(() => {});
                        }

                        return handleChangeItem({
                          id: item.id,
                          amount: +target.value,
                        });
                      },
                    }}
                  />
                </span>
                <span className="is-size-4">
                  <Field
                    error={errors.items?.[i]?.price}
                    onEnter={() => {
                      const price = watchParty(`items.${i}.price`);
                      if (price === item.price || isReadOnly) {
                        return;
                      }
                      handleChangeItem({
                        id: item.id,
                        price,
                      });
                    }}
                    inputProps={{
                      type: "number",
                      disabled: isReadOnly,
                      min: 0,
                      ...register(`items.${i}.price`),
                      onBlur: ({ target }) => {
                        if (+target.value === item.price) {
                          return new Promise(() => {});
                        }

                        return handleChangeItem({
                          id: item.id,
                          price: +target.value,
                        });
                      },
                    }}
                  />
                </span>
                <span
                  className={cx("is-size-4", {
                    "is-invisible": !partySettings.isDiscountVisible,
                  })}
                >
                  <Field
                    error={errors.items?.[i]?.discount}
                    onEnter={() => {
                      const discount = watchParty(`items.${i}.discount`);
                      if (discount === item.discount || isReadOnly) {
                        return;
                      }
                      handleChangeItem({
                        id: item.id,
                        discount,
                      });
                    }}
                    inputProps={{
                      type: "number",
                      step: 5,
                      min: 0,
                      disabled: isReadOnly,
                      max: 100,
                      ...register(`items.${i}.discount`),
                      onBlur: ({ target }) => {
                        if (+target.value === item.discount) {
                          return new Promise(() => {});
                        }

                        return handleChangeItem({
                          id: item.id,
                          discount: +target.value,
                        });
                      },
                    }}
                  />
                </span>
                <div
                  className={cx("checkbox-wrapper", {
                    "is-invisible": !partySettings.isEquallyVisible,
                  })}
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    disabled={isReadOnly}
                    {...register(`items.${i}.equally`)}
                    onChange={({ target }) =>
                      handleChangeItem({
                        id: item.id,
                        equally: target.checked,
                      })
                    }
                  />
                </div>
                {Object.keys(users).map((id) => {
                  if (item.equally) {
                    return (
                      <div className="checkbox-wrapper" key={id}>
                        <input
                          id={`items.${i}.users.${id}`}
                          type="checkbox"
                          className="is-size-4 checkbox"
                          disabled={isReadOnly}
                          checked={itemUsers?.[id]?.checked}
                          onChange={({ target }) =>
                            handleChangeUserInItem(target.checked, id, item.id)
                          }
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={id}>
                      <Field
                        error={errors.items?.[i]?.users?.[id]?.value}
                        onEnter={() => {
                          const value = watchParty(
                            `items.${i}.users.${id}.value`
                          );
                          if (value === itemUsers[id]?.value || isReadOnly) {
                            return;
                          }
                          handleUpdateUserItem({
                            itemId: item.id,
                            value,
                            userId: id,
                          });
                        }}
                        inputProps={{
                          type: "number",
                          id: `items.${i}.users.${id}`,
                          placeholder: "0",
                          min: 0,
                          disabled: isReadOnly,
                          ...register(`items.${i}.users.${id}.value`),
                          onBlur: ({ target }) => {
                            if (+target.value === itemUsers[id]?.value) {
                              return new Promise(() => {});
                            }

                            return handleUpdateUserItem({
                              itemId: item.id,
                              value: +target.value,
                              userId: id,
                            });
                          },
                        }}
                      />
                    </div>
                  );
                })}
              </PartyFormLayout>
            );
          })}
        </form>
      </Block>
      {editingItem ? (
        <ItemDetails
          handleChangeItem={handleChangeItem}
          item={editingItem}
          isReadOnly={isReadOnly}
          users={party.users}
          onClose={() => setEditingItem(null)}
        />
      ) : null}
    </>
  );
};

import { FC } from "react";
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

export const PartyForm: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
}> = ({ party, currentUser }) => {
  const { users } = party;
  const { partyId } = useParams();
  const handlers = useParty({ party });
  const { register, formState, watch: watchParty } = handlers;
  const { isValid, errors } = formState;
  const { watch, setValue } = useFormContext<FormSettings>();
  const partySettings = watch();

  if (!party.items.length || !partyId) {
    return <EmptyPartyLayout />;
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
    <Block title="Full bill">
      <PartyFormLayout {...partyLayoutProps}>
        <span className="is-size-6">Item name</span>
        <span className="is-size-6">Amount</span>
        <span className="is-size-6">Price</span>
        <span
          className={`is-size-6${
            partySettings.isDiscountVisible ? "" : " is-invisible"
          }`}
        >
          Discount<span className="is-size-7 has-text-grey ml-1">(%)</span>
        </span>
        <span
          className={cx("is-size-6", {
            "is-invisible": !partySettings.isEquallyVisible,
          })}
        >
          Is shared
        </span>
        {users ? (
          Object.values(users).map((user) => {
            const isCurrentUser = user.id === currentUser.id;
            return (
              <div className="user-column-title" key={user.id}>
                <span
                  className={cx("is-size-6 text-overflow-hidden is-clickable", {
                    "has-text-info": isCurrentUser,
                  })}
                  title={`Open detailed view for ${user.name}`}
                  onClick={() => {
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
                      title="Master of the party"
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
                    title="Remove item"
                    onClick={() => handleRemoveItem(item.id)}
                  />
                </div>

                <Field
                  error={errors.items?.[i]?.name}
                  onEnter={() => {
                    const name = watchParty(`items.${i}.name`);
                    if (name === item.name) {
                      return;
                    }
                    handleChangeItem({
                      id: item.id,
                      name,
                    });
                  }}
                  inputProps={{
                    type: "text",
                    ...register(`items.${i}.name`),
                    onBlur: ({ target }) => {
                      if (target.value === item.name) {
                        return new Promise(() => {});
                      }
                      return handleChangeItem({
                        id: item.id,
                        name: target.value,
                      });
                    },
                  }}
                />
              </div>
              <span className="is-size-4">
                <Field
                  error={errors.items?.[i]?.amount}
                  onEnter={() => {
                    const amount = watchParty(`items.${i}.amount`);
                    if (amount === item.amount) {
                      return;
                    }
                    handleChangeItem({
                      id: item.id,
                      amount,
                    });
                  }}
                  inputProps={{
                    type: "number",
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
                    if (price === item.price) {
                      return;
                    }
                    handleChangeItem({
                      id: item.id,
                      price,
                    });
                  }}
                  inputProps={{
                    type: "number",
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
                    if (discount === item.discount) {
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
                        type="checkbox"
                        className="is-size-4 checkbox"
                        checked={!!itemUsers?.[id]}
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
                        if (value === itemUsers[id]?.value) {
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
                        placeholder: "0",
                        min: 0,
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
  );
};

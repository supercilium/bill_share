import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router";
import { Block, Field } from "../../components";
import { Item } from "../../types/item";
import { PartyInterface } from "../../types/party";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { PartyFormLayout } from "../../components";
import { EmptyPartyLayout } from "../../layouts/emptyParty";
import { sendEvent } from "../../utils/eventHandlers";
import { OverflowHidden } from "../../components/styled/typography";
import {
  CheckboxWrapper,
  DeleteButton,
  UserColumnTitle,
} from "./PartyForm.styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParty } from "../../hooks/useParty";

export const PartyForm: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
}> = ({ party, currentUser }) => {
  const { users } = party;
  const { partyId } = useParams();
  const handlers = useParty({ party });
  const { register, formState } = handlers;
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
    sendEvent({
      type: "update item",
      userId: currentUser.id,
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
    sendEvent({
      type: shouldAddUser ? "add user item" : "remove user item",
      userId,
      partyId,
      itemId,
    });
  };
  const handleRemoveItem = (id: string) => {
    sendEvent({
      type: "remove item",
      userId: currentUser.id,
      partyId,
      itemId: id,
    });
  };
  const handleUpdateUserItem = async (data: {
    itemId: string;
    value: number;
    userId: string;
  }) => {
    sendEvent({
      type: "update user item",
      partyId,
      ...data,
    });
  };

  const partyLayoutProps: React.ComponentProps<typeof PartyFormLayout> = {
    amountOfUsers: users.length,
    isDiscountVisible: partySettings.isDiscountVisible,
    isEquallyVisible: partySettings.isEquallyVisible,
  };

  return (
    <Block title="Full bill">
      <PartyFormLayout {...partyLayoutProps}>
        <span className="is-size-6">Item name</span>
        <span className="is-size-6">Amount</span>
        <span className="is-size-6">Price</span>
        {partySettings.isDiscountVisible && (
          <span className="is-size-6">
            Discount<span className="is-size-7 has-text-grey ml-1">(%)</span>
          </span>
        )}
        {partySettings.isEquallyVisible && (
          <span className="is-size-6">Is shared</span>
        )}
        {users?.length > 0 ? (
          users.map((user) => {
            const isCurrentUser = user.id === currentUser.id;
            return (
              <UserColumnTitle
                key={user.id}
                hasIcon={user.id === party.owner.id}
              >
                <OverflowHidden
                  className={`is-clickable is-size-6${
                    isCurrentUser ? " has-text-info" : ""
                  }`}
                  title={`Open detailed view for ${user.name}`}
                  onClick={() => {
                    setValue("user", user);
                    setValue("view", "user");
                  }}
                >
                  {user.name}
                </OverflowHidden>
                {user.id === party.owner.id && (
                  <i>
                    <FontAwesomeIcon
                      className={isCurrentUser ? " has-text-info" : ""}
                      icon="crown"
                      size="2xs"
                      title="Master of the party"
                    />
                  </i>
                )}
              </UserColumnTitle>
            );
          })
        ) : (
          <div />
        )}
      </PartyFormLayout>

      <form>
        {party.items.map((itemProps, i) => {
          const { users: itemUsers, ...item } = itemProps;
          return (
            <PartyFormLayout
              {...partyLayoutProps}
              className="my-3"
              key={item.id}
            >
              <div className="is-size-4 is-flex ">
                <DeleteButton>
                  <button
                    type="button"
                    className="delete mr-2"
                    title="Remove item"
                    onClick={() => handleRemoveItem(item.id)}
                  />
                </DeleteButton>

                <Field
                  error={errors.items?.[i]?.name}
                  inputProps={{
                    type: "text",
                    ...register(`items.${i}.name`),
                    onBlur: ({ target }) => {
                      if (target.value === item.name || !isValid) {
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
                  inputProps={{
                    type: "number",
                    min: 1,
                    ...register(`items.${i}.amount`),
                    onBlur: ({ target }) => {
                      if (+target.value === item.amount || !isValid) {
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
                  inputProps={{
                    type: "number",
                    min: 0,
                    ...register(`items.${i}.price`),
                    onBlur: ({ target }) => {
                      if (+target.value === item.price || !isValid) {
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
              {partySettings.isDiscountVisible && (
                <span className="is-size-4">
                  <Field
                    error={errors.items?.[i]?.discount}
                    inputProps={{
                      type: "number",
                      step: 5,
                      min: 0,
                      max: 100,
                      ...register(`items.${i}.discount`),
                      onBlur: ({ target }) => {
                        if (+target.value === item.discount || !isValid) {
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
              )}
              {partySettings.isEquallyVisible && (
                <CheckboxWrapper>
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
                </CheckboxWrapper>
              )}
              {users.map(({ id }) => {
                if (item.equally) {
                  return (
                    <CheckboxWrapper key={id}>
                      <input
                        type="checkbox"
                        className="is-size-4 checkbox"
                        checked={!!itemUsers?.find((user) => user.id === id)}
                        onChange={({ target }) =>
                          handleChangeUserInItem(target.checked, id, item.id)
                        }
                      />
                    </CheckboxWrapper>
                  );
                }
                const userIndex = itemUsers.findIndex((user) => user.id === id);

                return (
                  <div key={id}>
                    <Field
                      error={errors.items?.[i]?.users?.[userIndex]?.value}
                      inputProps={{
                        type: "number",
                        placeholder: "0",
                        min: 0,
                        ...register(`items.${i}.users.${userIndex}.value`),
                        onBlur: ({ target }) => {
                          if (
                            +target.value === itemUsers[userIndex]?.value ||
                            !isValid
                          ) {
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

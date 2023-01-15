import { FC, useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Block, Field } from "../components";
import { Item } from "../types/item";
import { PartyInterface } from "../types/party";
import { FormSettings } from "../contexts/PartySettingsContext";
import { PartyFormLayout } from "../layouts/partyFormLayout";
import { EmptyPartyLayout } from "../layouts/emptyParty";
import { sendEvent } from "../utils/eventHandlers";
import { itemsSchema } from "../utils/validation";

export const PartyForm: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
}> = ({ party, currentUser }) => {
  const { users } = party;
  const { partyId } = useParams();
  const { register, reset, formState } = useForm<PartyInterface>({
    resolver: yupResolver(itemsSchema),
    defaultValues: party,
    mode: "all",
  });
  const { isValid, errors } = formState;
  const { watch, setValue } = useFormContext<FormSettings>();
  const partySettings = watch();

  useEffect(() => {
    reset(party);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party]);

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
  const partyLayoutProps: Omit<
    React.ComponentProps<typeof PartyFormLayout>,
    "children"
  > = {
    amountOfUsers: users.length,
    isDiscountVisible: partySettings.isDiscountVisible,
    isEquallyVisible: partySettings.isEquallyVisible,
  };

  return (
    <Block title="Party form">
      <PartyFormLayout {...partyLayoutProps}>
        <span className="is-size-6">Item name</span>
        <span className="is-size-6">Amount</span>
        <span className="is-size-6">Price</span>
        {partySettings.isDiscountVisible && (
          <span className="is-size-6">Discount</span>
        )}
        {partySettings.isEquallyVisible && (
          <span className="is-size-6">Equally</span>
        )}
        {users?.length > 0 ? (
          users.map(({ id, name }) => (
            <span
              key={id}
              className={`is-clickable is-size-6${
                id === currentUser.id ? " has-text-info" : ""
              }`}
              style={{ transform: "rotate(-42deg)" }}
              title="Open detailed view"
              onClick={() => {
                setValue("user", id);
                setValue("view", "user");
              }}
            >
              {name}
            </span>
          ))
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
              <span className="is-size-4 is-flex is-align-items-center ">
                <button
                  type="button"
                  className="delete mr-2"
                  title="Remove item"
                  onClick={() => handleRemoveItem(item.id)}
                />

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
              </span>
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
                      step: 0.1,
                      min: 0,
                      max: 1,
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
                <input
                  type="checkbox"
                  className="is-size-4 checkbox mr-4"
                  {...register(`items.${i}.equally`)}
                  onChange={({ target }) =>
                    handleChangeItem({
                      id: item.id,
                      equally: target.checked,
                    })
                  }
                />
              )}
              {users.map(({ id }) => (
                <input
                  key={id}
                  type="checkbox"
                  className="is-size-4 checkbox"
                  checked={!!itemUsers?.find((user) => user.id === id)}
                  onChange={({ target }) =>
                    handleChangeUserInItem(target.checked, id, item.id)
                  }
                />
              ))}
            </PartyFormLayout>
          );
        })}
      </form>
    </Block>
  );
};

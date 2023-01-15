import { FC, useEffect } from "react";
import * as yup from "yup";
import { useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Block, Columns, Field } from "../components";
import { PartyInterface } from "../types/party";
import { socketClient } from "../__api__/socket";
import { useParams } from "react-router";
import { Item } from "../types/item";
import { UserFormLayout } from "../layouts/userFormLayout";
import { FormSettings } from "../contexts/PartySettingsContext";
import { EmptyPartyLayout } from "../layouts/emptyParty";

const schema = yup
  .object({
    items: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        price: yup.number().min(0).integer().default(0).required(),
        amount: yup.number().min(1).integer().required(),
        discount: yup.number().min(0).max(1).default(0),
      })
    ),
  })
  .required();

export const UserPartyForm: FC<{
  party: PartyInterface;
  userId: string;
}> = ({ party, userId }) => {
  const { partyId } = useParams();
  const { register, reset, formState } = useForm<PartyInterface>({
    resolver: yupResolver(schema),
    defaultValues: party,
    mode: "all",
  });
  const { isValid, errors } = formState;
  const { watch } = useFormContext<FormSettings>();
  const partySettings = watch();

  useEffect(() => {
    reset(party);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party]);

  if (!party.items?.length) {
    return <EmptyPartyLayout />;
  }
  const userItems: Array<
    Item & { originalIndex: number; originalUserIndex: number; total: number }
  > = [];
  const restItems: Array<Item & { originalIndex: number }> = [];

  party.items.forEach((item, i) => {
    const userIndex = item.users.findIndex(({ id }) => userId === id);
    if (userIndex >= 0) {
      const participants = item.users.filter((user) => user.value > 0);
      userItems.push({
        ...item,
        originalIndex: i,
        originalUserIndex: userIndex,
        total:
          (item.price - item.price * (item.discount || 0)) /
          participants.length,
      });
    } else {
      restItems.push({ ...item, originalIndex: i });
    }
  });

  const handleChangeUserInItem = (id: string, shouldAddUser: boolean) => {
    socketClient.socket.send(
      JSON.stringify({
        type: shouldAddUser ? "add user to item" : "remove user from item",
        userId,
        partyId,
        itemId: id,
        value: 0,
      })
    );
  };
  const handleChangeItem = async (data: Partial<Omit<Item, "users">>) => {
    socketClient.socket.send(
      JSON.stringify({
        type: "update item",
        userId,
        partyId,
        ...data,
      })
    );
  };

  return (
    <Block title="Your score in party">
      <form>
        <Columns>
          <div className="box mt-4">
            <p className="is-size-4">In your bill</p>
            <UserFormLayout
              isDiscountVisible={partySettings.isDiscountVisible}
              isEquallyVisible={partySettings.isEquallyVisible}
            >
              <span className="is-size-6">Item name</span>
              <span className="is-size-6">Amount</span>
              <span className="is-size-6">Price</span>
              {partySettings.isDiscountVisible && (
                <span className="is-size-6">Discount</span>
              )}
            </UserFormLayout>

            {userItems.map((item, i) => {
              return (
                <>
                  <UserFormLayout
                    key={item.id}
                    isDiscountVisible={partySettings.isDiscountVisible}
                    isEquallyVisible={partySettings.isEquallyVisible}
                  >
                    <span className="is-size-4 is-flex is-align-items-center">
                      <button
                        type="button"
                        className="delete mr-2"
                        title="Remove item from my bill"
                        onClick={() => handleChangeUserInItem(item.id, false)}
                      />
                      <Field
                        error={errors.items?.[i]?.name}
                        inputProps={{
                          type: "text",
                          ...register(`items.${item.originalIndex}.name`),
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
                      {!item.equally ? (
                        <Field
                          error={errors.items?.[i]?.amount}
                          inputProps={{
                            type: "number",
                            min: 1,
                            ...register(
                              `items.${item.originalIndex}.users.${item.originalUserIndex}.value`
                            ),
                            //   TODO: update user's value
                            //   onBlur: ({ target }) => {
                            //     if (+target.value === item.amount || !isValid) {
                            //       return new Promise(() => {});
                            //     }

                            //     return handleChangeItem({
                            //       id: item.id,
                            //       amount: +target.value,
                            //     });
                            //   },
                          }}
                        />
                      ) : (
                        <span className="has-text-grey-light">-</span>
                      )}
                    </span>
                    <span className="is-size-4">
                      <Field
                        error={errors.items?.[i]?.price}
                        inputProps={{
                          type: "number",
                          min: 0,
                          ...register(`items.${item.originalIndex}.price`),
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
                            ...register(`items.${item.originalIndex}.discount`),
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
                    <span className="is-size-5 has-text-primary-dark">
                      {item.total.toFixed(2)}
                    </span>
                  </UserFormLayout>
                  {partySettings.isEquallyVisible && (
                    <Field
                      label=" Calculate item equally"
                      inputProps={{
                        type: "checkbox",
                        ...register(`items.${item.originalIndex}.equally`),
                        onChange: ({ target }) =>
                          handleChangeItem({
                            id: item.id,
                            equally: target.checked,
                          }),
                      }}
                    />
                  )}
                </>
              );
            })}
            <p className="is-size-4 mt-2 has-text-primary-dark has-text-right">
              Total:{" "}
              {userItems.reduce((acc, item) => acc + item.total, 0).toFixed(2)}
            </p>
          </div>
          <div className="mt-4">
            {restItems.length > 0 && (
              <>
                <p className="is-size-4">Rest items</p>
                <UserFormLayout
                  isDiscountVisible={false}
                  isEquallyVisible={false}
                >
                  <span className="is-size-6">Item name</span>
                  <span className="is-size-6">Amount</span>
                  <span className="is-size-6">Price</span>
                </UserFormLayout>
                {restItems.map((item) => (
                  <div
                    key={item.id}
                    className="is-clickable"
                    onClick={() => handleChangeUserInItem(item.id, true)}
                    title="Add to my bill"
                  >
                    <UserFormLayout
                      isDiscountVisible={false}
                      isEquallyVisible={false}
                      key={item.id}
                    >
                      <span className="is-size-5">{item.name}</span>
                      <span className="is-size-5">{item.amount}</span>
                      <span className="is-size-5">{item.price}</span>
                    </UserFormLayout>
                  </div>
                ))}
              </>
            )}
          </div>
        </Columns>
      </form>
    </Block>
  );
};

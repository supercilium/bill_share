import React, { FC, useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Block, Columns, Field } from "../components";
import { PartyInterface } from "../types/party";
import { useParams } from "react-router";
import { Item } from "../types/item";
import { UserFormLayout } from "../layouts/userFormLayout";
import { FormSettings } from "../contexts/PartySettingsContext";
import { EmptyPartyLayout } from "../layouts/emptyParty";
import {
  getBaseTotal,
  getPartyUserBaseTotal,
  getPartyUserDiscount,
  splitItems,
} from "../utils/calculation";
import { sendEvent } from "../utils/eventHandlers";
import { itemsSchema } from "../utils/validation";
import { User } from "../types/user";
import { PartyHeader } from "./PartyHeader";

export const UserPartyForm: FC<{
  party: PartyInterface;
  user: User;
}> = ({ party, user }) => {
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
    const total = getBaseTotal(party.items);
    setValue("total", total);
    setValue("discountPercent", party.discount);
    if (!partySettings.discount && party.discount) {
      setValue(
        "discount",
        Number((+(party.discount || 0) * +total * 0.01).toFixed(2))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party]);

  if (!party.items?.length || !partyId) {
    return <EmptyPartyLayout />;
  }
  const userId = user.id;
  const [userItems, restItems] = splitItems(party.items, userId);

  const handleChangeUserInItem = (id: string, shouldAddUser: boolean) => {
    sendEvent({
      type: shouldAddUser ? "add user item" : "remove user item",
      userId,
      partyId,
      itemId: id,
    });
  };
  const handleChangeItem = async (
    data: Partial<Omit<Item, "id" | "users">> & { itemId: string }
  ) => {
    sendEvent({
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
    sendEvent({
      type: "update user item",
      userId,
      partyId,
      ...data,
    });
  };
  const total = getPartyUserBaseTotal(userItems, user.id);
  const discount =
    getPartyUserDiscount(userItems, user.id) +
    total * (partySettings.discountPercent || 0) * 0.01;

  return (
    <Block title={<PartyHeader users={party.users} />}>
      <form>
        <Columns>
          <div className="box mt-4">
            {userItems.length ? (
              <>
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
                    <React.Fragment key={item.id}>
                      <UserFormLayout
                        isDiscountVisible={partySettings.isDiscountVisible}
                        isEquallyVisible={partySettings.isEquallyVisible}
                      >
                        <span className="is-size-4 is-flex is-align-items-center">
                          <button
                            type="button"
                            className="delete mr-2"
                            title="Remove item from my bill"
                            onClick={() =>
                              handleChangeUserInItem(item.id, false)
                            }
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
                                  itemId: item.id,
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
                                min: 0,
                                ...register(
                                  `items.${item.originalIndex}.users.${item.originalUserIndex}.value`
                                ),
                                onBlur: ({ target }) => {
                                  if (
                                    +target.value ===
                                      item.users[item.originalUserIndex]
                                        .value ||
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
                                  itemId: item.id,
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
                    <p className="is-size-5 mt-2 has-text-grey has-text-right">
                      Base cost: {total.toFixed(2)}
                    </p>
                    <p className="is-size-5 mt-2 has-text-grey has-text-right">
                      Discount: {discount.toFixed(2)}
                    </p>
                    <hr className="my-3" />
                    <p className="is-size-4 mt-2 has-text-primary-dark has-text-right">
                      Total: {(total - discount).toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="is-size-4 mt-2 has-text-primary-dark has-text-right">
                    Total: {total.toFixed(2)}
                  </p>
                )}
              </>
            ) : (
              <EmptyPartyLayout />
            )}
          </div>
          <div>
            {restItems.length > 0 && (
              <div className="box mt-4">
                <p className="is-size-4">More items from party</p>
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
                    className={item.isMuted ? "has-text-grey" : "is-clickable"}
                    onClick={() =>
                      !item.isMuted && handleChangeUserInItem(item.id, true)
                    }
                    title={
                      item.isMuted ? "Already in my bill" : "Add to my bill"
                    }
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
              </div>
            )}
          </div>
        </Columns>
      </form>
    </Block>
  );
};

import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Block, Columns, Field } from "../../components";
import { PartyInterface } from "../../types/party";
import { useParams } from "react-router";
import { Item } from "../../types/item";
import { UserFormLayout } from "../../components/styled/userFormLayout";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { EmptyPartyLayout } from "../../layouts/emptyParty";
import {
  getPartyUserBaseTotal,
  getPartyUserDiscount,
  splitItems,
} from "../../utils/calculation";
import { User } from "../../types/user";
import { PartyHeader } from "../PartyHeader";
import { PricePerRow, StyledUserForm } from "./UserPartyForm.styles";
import { FormWrapper } from "../../components/styled/formWrapper";
import { OverflowHidden } from "../../components/styled/typography";
import { useParty } from "../../hooks/useParty";
import { Transport } from "../../services/transport";

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
  const total = getPartyUserBaseTotal(userItems, user.id);
  const discount =
    getPartyUserDiscount(userItems, user.id) +
    total * (partySettings.discountPercent || 0) * 0.01;

  return (
    <Block title={<PartyHeader users={party.users} master={party.owner} />}>
      {!party.items?.length ? (
        <EmptyPartyLayout />
      ) : (
        <form noValidate={true}>
          <Columns containerProps={{ className: "is-flex-wrap-wrap" }}>
            <FormWrapper>
              <StyledUserForm className="box mt-4">
                {userItems.length ? (
                  <>
                    <p className="is-size-5-touch is-size-4-desktop">
                      In your bill
                    </p>
                    <UserFormLayout
                      isDiscountVisible={partySettings.isDiscountVisible}
                      isEquallyVisible={partySettings.isEquallyVisible}
                    >
                      <span className="is-size-6">Item name</span>
                      <span className="is-size-6">Amount</span>
                      <span className="is-size-6">Price</span>
                      {partySettings.isDiscountVisible && (
                        <span className="is-size-6">
                          Discount
                          <span className="is-size-7 has-text-grey ml-1">
                            (%)
                          </span>
                        </span>
                      )}
                    </UserFormLayout>

                    {userItems.map((item, i) => {
                      return (
                        <React.Fragment key={item.id}>
                          <UserFormLayout
                            className="my-3"
                            isDiscountVisible={partySettings.isDiscountVisible}
                            isEquallyVisible={partySettings.isEquallyVisible}
                          >
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
                                      item.originalUserIndex
                                    ]?.value
                                  }
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
                            {partySettings.isDiscountVisible && (
                              <span className="is-size-5-touch is-size-4-desktop">
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
                            <PricePerRow className="is-size-6 has-text-primary-dark">
                              {item.total.toFixed(2)}
                            </PricePerRow>
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
              </StyledUserForm>
            </FormWrapper>
            <FormWrapper>
              {restItems.length > 0 && (
                <StyledUserForm className="box mt-4">
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
                      <UserFormLayout
                        className="my-3"
                        isDiscountVisible={false}
                        isEquallyVisible={false}
                        key={item.id}
                      >
                        <OverflowHidden className="is-size-5">
                          {item.name}
                        </OverflowHidden>
                        <span className="is-size-5">{item.amount}</span>
                        <span className="is-size-5">{item.price}</span>
                      </UserFormLayout>
                    </div>
                  ))}
                </StyledUserForm>
              )}
            </FormWrapper>
          </Columns>
        </form>
      )}
    </Block>
  );
};

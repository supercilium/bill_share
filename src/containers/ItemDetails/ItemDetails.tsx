import { FC, Fragment } from "react";
import { Block, Columns, Field } from "../../components";
import { useForm, useFormContext } from "react-hook-form";
import { PartyInterface } from "../../types/party";
import { Item } from "../../types/item";
import { createPortal } from "react-dom";
import { Modal } from "../../components/Modal";
import { useTranslation } from "react-i18next";
import {
  getItemBaseTotal,
  getItemDiscount,
  getItemTotal,
  splitItems,
} from "../../utils/calculation";
import { FormSettings } from "../../contexts/PartySettingsContext";
import "./ItemDetails.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import { itemSchema } from "../../services/validation";

interface ItemDetailsProps {
  handleChangeItem: (value: Partial<Item>) => Promise<void>;
  isReadOnly?: boolean;
  item: Item;
  users: PartyInterface["users"];
  onClose: () => void;
}

export const ItemDetails: FC<ItemDetailsProps> = ({
  handleChangeItem,
  isReadOnly = true,
  item: defaultValues,
  users,
  onClose,
}) => {
  const { t } = useTranslation();
  const handlers = useForm<Item>({
    resolver: yupResolver(itemSchema),
    defaultValues,
    mode: "all",
  });
  const { register, formState, watch, setValue } = handlers;
  const { isValid, errors } = formState;
  const { watch: watchSettings } = useFormContext<FormSettings>();

  const item = watch();

  const discount = watchSettings("discount");
  const isPercentage = watchSettings("isPercentage");
  const partyTotal = watchSettings("total");
  const totalItemsDiscount = watchSettings("totalItemsDiscount");

  const baseTotal = getItemBaseTotal(item, item.amount);
  const itemTotalWithDiscount = getItemTotal(item, item.amount);
  const discountFull = isPercentage
    ? +baseTotal * (discount ?? 0) * 0.01
    : (discount ?? 0) / (+partyTotal - totalItemsDiscount);
  const itemDiscount = getItemDiscount(item, item.amount);

  const renderDiscountForBill = () => {
    return (
      <span>
        <span className="has-text-weight-semibold">
          {`${discount?.toFixed(2)}${isPercentage ? "%" : ""} `}
        </span>
        {discount ? (
          <span className="has-text-grey">{`(~${(isPercentage
            ? discountFull
            : discountFull * 100
          ).toFixed(2)}${isPercentage ? "" : "%"})`}</span>
        ) : null}
      </span>
    );
  };

  return createPortal(
    <Modal onClose={onClose} isOpen={true}>
      <Block title={t("TITLE_EDITING_ITEM", { item: item.name })}>
        <Field
          label={t("ITEM_NAME")}
          error={errors?.name}
          inputProps={{
            type: "text",
            disabled: isReadOnly,
            ...register("name"),
          }}
        />
        <Columns>
          <div>
            <Field
              label={t("AMOUNT")}
              error={errors.amount}
              inputProps={{
                type: "number",
                disabled: isReadOnly,
                min: 1,
                ...register(`amount`),
              }}
            />
          </div>
          <div>
            <Field
              label={t("PRICE")}
              error={errors.price}
              inputProps={{
                type: "number",
                disabled: isReadOnly,
                min: 0,
                ...register(`price`),
              }}
            />
          </div>
          <div>
            <Field
              label={t("DISCOUNT")}
              error={errors.discount}
              inputProps={{
                type: "number",
                step: 5,
                min: 0,
                disabled: isReadOnly,
                max: 100,
                ...register(`discount`),
              }}
            />
          </div>
        </Columns>
        <Field
          label={t("LABEL_SHARE_FOR_ALL")}
          inputProps={{
            disabled: isReadOnly,
            type: "checkbox",
            ...register(`equally`),
          }}
        />
        <Block title={t("TITLE_ITEM_DETAILS", { item: item.name })}>
          <div className="details-row mb-3">
            <div className="details-column">
              <span>{t("AMOUNT_OF_ITEMS")}</span>
              <span className="has-text-weight-semibold">{item.amount}</span>
            </div>
            <div className="details-column">
              <span>{t("PRICE_PER_POSITION")}</span>
              <span className="has-text-weight-semibold">{item.price}</span>
            </div>
            <div className="details-column">
              <span>{t("TOTAL_PRICE")}</span>
              <span className="has-text-weight-semibold">{baseTotal}</span>
            </div>
            <div className="details-column">
              <span>{t("DISCOUNT_FOR_BILL")}</span>
              <span className="has-text-weight-semibold">
                {renderDiscountForBill()}
              </span>
            </div>
            <div className="details-column">
              <span>{t("DISCOUNT_FOR_ITEM")}</span>
              <span>
                <span className="has-text-weight-semibold">
                  {itemDiscount.toFixed(2) || "-"}
                </span>
                {itemDiscount > 0 && (
                  <span className="has-text-grey">{`(${item.discount?.toFixed(
                    2
                  )}%)`}</span>
                )}
              </span>
            </div>
            <div className="details-column">
              <span>{t("TOTAL_ITEM_WITH_DISCOUNT")}</span>
              <span className="has-text-weight-semibold">
                {(itemTotalWithDiscount * (1 - discountFull)).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="user-row">
            {Object.keys(users).map((id) => {
              const [userItems] = splitItems([item], id);

              if (item.equally) {
                return (
                  <Fragment key={id}>
                    <Field
                      label={` ${users[id].name}`}
                      inputProps={{
                        disabled: isReadOnly,
                        type: "checkbox",
                        checked:
                          item.users?.[id] && "value" in item.users?.[id],
                        onChange: (event) => {
                          if (event.target.checked) {
                            setValue(`users.${id}.value`, 1);
                          } else {
                            const usersItem = { ...item.users[id] };
                            delete usersItem.value;
                            setValue(`users.${id}`, usersItem);
                          }
                          return new Promise(() => {});
                        },
                      }}
                    />
                    <div>
                      <span>{userItems?.[0]?.total.toFixed(2) || "-"}</span>
                    </div>
                  </Fragment>
                );
              }

              return (
                <Fragment key={id}>
                  <Field
                    label={users[id].name}
                    error={errors.users?.[id]?.value}
                    inputProps={{
                      type: "number",
                      id: `users.${id}`,
                      placeholder: "0",
                      min: 0,
                      disabled: isReadOnly,
                      ...register(`users.${id}.value`),
                    }}
                  />
                  <div>
                    <span>{userItems?.[0]?.total.toFixed(2) || "-"}</span>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </Block>
        <button
          type="submit"
          className="button is-primary add-item-button mb-3 mr-3"
          onClick={() => handleChangeItem(item)}
          disabled={!isValid || isReadOnly}
        >
          {t("BUTTON_SAVE")}
        </button>
        <button
          onClick={onClose}
          type="button"
          className="button add-item-button mb-3"
        >
          {t("BUTTON_CANCEL")}
        </button>
      </Block>
    </Modal>,
    document.body
  );
};

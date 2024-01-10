import { Block, Field } from "../../components";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Transport } from "../../services/transport";
import { addItemSchema } from "../../services/validation";
import { FC, useState } from "react";
import "./AddItemForm.scss";
import { useTranslation } from "react-i18next";

interface ItemCreationInterface {
  name: string;
  price: number;
  amount: number;
  equally: boolean;
}

type PriceType = "per item" | "full";

interface Props {
  isReadOnly?: boolean;
}

export const AddItemForm: FC<Props> = ({ isReadOnly = true }) => {
  const { partyId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user") ?? "{}") || {};
  const [priceType, setPriceType] = useState<PriceType>("full");

  const formHandlers = useForm<ItemCreationInterface>({
    resolver: yupResolver(addItemSchema),
    defaultValues: {
      name: "",
      price: 0,
      amount: 1,
      equally: false,
    },
    mode: "all",
  });

  const { isValid, isDirty, errors } = formHandlers.formState;

  const handleAddItem = (data: ItemCreationInterface) => {
    Transport.sendEvent({
      type: "add item",
      userId: currentUser.id,
      currentUser: currentUser.id,
      partyId: partyId as string,
      ...data,
      price: priceType === "full" ? data.price / data.amount : data.price,
    });
    formHandlers.reset();
  };
  const { t } = useTranslation();

  return (
    <Block title={t("TITLE_ADD_ITEM_FORM")}>
      <form
        noValidate={true}
        className="add-item-layout mb-3"
        onSubmit={formHandlers.handleSubmit(handleAddItem)}
      >
        <div className="wide-track mb-3">
          <Field
            label={t("ITEM_NAME")}
            error={errors.name}
            inputProps={{
              type: "text",
              disabled: isReadOnly,
              placeholder: t("LABEL_ITEM_NAME"),
              autoComplete: "item name",
              ...formHandlers.register("name"),
            }}
          />
        </div>
        <Field
          label={t("AMOUNT")}
          error={errors.amount}
          inputProps={{
            type: "number",
            disabled: isReadOnly,
            placeholder: t("LABEL_AMOUNT"),
            min: 1,
            ...formHandlers.register("amount"),
          }}
        />
        <Field
          label={t("PRICE")}
          error={errors.price}
          inputProps={{
            type: "number",
            disabled: isReadOnly,
            step: 1,
            min: 0,
            formNoValidate: true,
            ...formHandlers.register("price"),
          }}
        />
        <button
          type="submit"
          className="button add-item-button mb-3"
          disabled={!isValid || !isDirty || isReadOnly}
        >
          {t("BUTTON_ADD_ITEM")}
        </button>
        <div className="wide-track">
          <Field
            label={t("LABEL_SHARE_FOR_ALL")}
            inputProps={{
              disabled: isReadOnly,
              type: "checkbox",
              ...formHandlers.register("equally"),
            }}
          />
        </div>
      </form>
      <div>
        <div className="field">
          <div className="control">
            <label className={`radio mr-5`}>
              <input
                type="radio"
                value="full"
                className="radio mr-2"
                disabled={isReadOnly}
                checked={priceType === "full"}
                onChange={({ target }) =>
                  setPriceType(target.value as PriceType)
                }
              />
              {t("LABEL_FULL_PRICE")}
            </label>

            <label className={`radio`}>
              <input
                type="radio"
                value="per item"
                className="radio mr-2"
                disabled={isReadOnly}
                checked={priceType === "per item"}
                onChange={({ target }) =>
                  setPriceType(target.value as PriceType)
                }
              />
              {t("LABEL_PRICE_PER_ITEM")}
            </label>
          </div>
        </div>
      </div>
    </Block>
  );
};

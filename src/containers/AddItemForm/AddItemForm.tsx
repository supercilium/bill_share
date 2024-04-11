import { Block, Field } from "../../components";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Transport } from "../../services/transport";
import { addItemSchema } from "../../services/validation";
import { FC, memo, useCallback, useMemo, useState } from "react";
import "./AddItemForm.scss";
import { useTranslation } from "react-i18next";
import type { User } from "../../types/user";
import { SelectField } from "../../components/SelectField";

interface ItemCreationInterface {
  name: string;
  price: number;
  amount: number;
  equally: boolean;
  users?: string[];
}

type PriceType = "per item" | "full";

interface Props {
  isReadOnly?: boolean;
  onClose: () => void;
  partyUsers: Array<{ id: string; name: string }>;
}

const currentUser = JSON.parse(localStorage.getItem("user") ?? "{}") || {};

export const AddItemForm: FC<Props> = memo(
  ({ isReadOnly = true, onClose, partyUsers }) => {
    const { partyId } = useParams();
    const [priceType, setPriceType] = useState<PriceType>("full");

    const defaultValues = useMemo(() => {
      return {
        name: "",
        price: 0,
        amount: 1,
        equally: false,
        users: [currentUser?.id],
      };
    }, []);

    const formHandlers = useForm<ItemCreationInterface>({
      resolver: yupResolver(addItemSchema),
      defaultValues,
      mode: "all",
    });

    const { isValid, isDirty, errors } = formHandlers.formState;

    const handleAddItem = useCallback(
      (data: ItemCreationInterface) => {
        Transport.sendEvent({
          type: "add item",
          userId: currentUser.id,
          currentUser: currentUser.id,
          partyId: partyId as string,
          ...data,
          price: priceType === "full" ? data.price / data.amount : data.price,
        });
        formHandlers.reset();
      },
      [formHandlers, partyId, priceType]
    );

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
                autoFocus: true,
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
          <div className="shared mb-4">
            <Field
              label={t("LABEL_SHARE_FOR_ALL")}
              inputProps={{
                disabled: isReadOnly,
                type: "checkbox",
                ...formHandlers.register("equally"),
              }}
            />
          </div>

          <div className="user">
            <p className="is-size-5 mb-2">{t("LABEL_SELECT_USER")}</p>
            <div className="is-flex">
              {partyUsers.map((user) => (
                <Field
                  key={user.id}
                  label={` ${user.name}`}
                  inputProps={{
                    disabled: isReadOnly || true,
                    type: "checkbox",
                    value: user.id,
                    ...formHandlers.register("users"),
                  }}
                />
              ))}
            </div>
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
        <div>
          <button
            type="submit"
            className="button is-primary add-item-button mb-3  mr-3"
            disabled={!isValid || !isDirty || isReadOnly}
            onClick={() => {
              formHandlers.handleSubmit(handleAddItem)();
              onClose();
            }}
          >
            {t("BUTTON_ADD_ITEM")}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="button add-item-button mb-3"
          >
            {t("BUTTON_CANCEL")}
          </button>
        </div>
      </Block>
    );
  }
);

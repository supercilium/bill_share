import { FC } from "react";
import { Block, Field } from "../../components";
import { itemSchema } from "../../services/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Item } from "../../types/item";

interface EditItemFormProps {
  isReadOnly?: boolean;
  onClose: () => void;
  onChangeItem: (
    value: Partial<Omit<Item, "id" | "users">> & { itemId: string }
  ) => void;
  item: Item;
}

export const EditItemForm: FC<EditItemFormProps> = ({
  isReadOnly = true,
  item,
  onClose,
  onChangeItem,
}) => {
  const formHandlers = useForm<Item>({
    resolver: yupResolver(itemSchema),
    defaultValues: item,
    mode: "all",
  });
  const { t } = useTranslation();
  const { isValid, isDirty, errors } = formHandlers.formState;

  return (
    <Block title={t("TITLE_EDIT_ITEM_FORM")}>
      <form
        noValidate={true}
        onSubmit={formHandlers.handleSubmit((values) =>
          onChangeItem({ ...values, itemId: values.id })
        )}
      >
        <div className="add-item-layout mb-3">
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
          <Field
            label={t("DISCOUNT")}
            error={errors.discount}
            inputProps={{
              type: "number",
              disabled: isReadOnly,
              step: 5,
              min: 0,
              formNoValidate: true,
              ...formHandlers.register("discount"),
            }}
          />
        </div>
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
        <button
          type="submit"
          className="button is-primary add-item-button mb-3 mr-3"
          disabled={!isValid || !isDirty || isReadOnly}
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
      </form>
    </Block>
  );
};

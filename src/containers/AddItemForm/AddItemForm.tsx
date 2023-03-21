import { Block, Field } from "../../components";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Transport } from "../../services/transport";
import { addItemSchema } from "../../services/validation";
import { useState } from "react";
import "./AddItemForm.scss";

interface ItemCreationInterface {
  name: string;
  price: number;
  amount: number;
  equally: boolean;
}

type PriceType = "per item" | "full";

export const AddItemForm = () => {
  const { partyId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};
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
      partyId: partyId as string,
      ...data,
      price: priceType === "full" ? data.price / data.amount : data.price,
    });
    formHandlers.reset();
  };

  return (
    <Block title="Add new item to share">
      <form
        noValidate={true}
        className="add-item-layout mb-3"
        onSubmit={formHandlers.handleSubmit(handleAddItem)}
      >
        <div className="wide-track mb-3">
          <Field
            label="Item name"
            error={errors.name}
            inputProps={{
              type: "text",
              placeholder: "Enter item name",
              autoComplete: "item name",
              ...formHandlers.register("name"),
            }}
          />
        </div>
        <Field
          label="Amount"
          error={errors.amount}
          inputProps={{
            type: "number",
            min: 1,
            ...formHandlers.register("amount"),
          }}
        />
        <Field
          label="Price"
          error={errors.price}
          inputProps={{
            type: "number",
            step: 1,
            min: 0,
            formNoValidate: true,
            ...formHandlers.register("price"),
          }}
        />
        <button
          type="submit"
          className="button add-item-button mb-3"
          disabled={!isValid || !isDirty}
        >
          Add item
        </button>
        <div className="wide-track">
          <Field
            label=" Share item for all"
            inputProps={{
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
                checked={priceType === "full"}
                onChange={({ target }) =>
                  setPriceType(target.value as PriceType)
                }
              />
              Enter full price
            </label>

            <label className={`radio`}>
              <input
                type="radio"
                value="per item"
                className="radio mr-2"
                checked={priceType === "per item"}
                onChange={({ target }) =>
                  setPriceType(target.value as PriceType)
                }
              />
              Enter price per item
            </label>
          </div>
        </div>
      </div>
    </Block>
  );
};

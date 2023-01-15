import { Block, Field } from "../components";
import { useForm } from "react-hook-form";
import { socketClient } from "../__api__/socket";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    item: yup.string().required(),
    price: yup.number().min(0).integer().default(0).required(),
    amount: yup.number().min(1).integer().required(),
  })
  .required();

interface ItemCreationInterface {
  item: string;
  price: number;
  amount: number;
}

export const AddItemForm = () => {
  const { partyId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};

  const socket = socketClient.socket;
  const formHandlers = useForm<ItemCreationInterface>({
    resolver: yupResolver(schema),
    defaultValues: {
      item: "",
      price: 0,
      amount: 1,
    },
    mode: "all",
  });
  const { isValid, isDirty, errors } = formHandlers.formState;

  const handleAddItem = (data: ItemCreationInterface) => {
    socket.send(
      JSON.stringify({
        type: "add item",
        userId: currentUser.id,
        partyId,
        item: data.item,
        price: data.price,
        amount: data.amount,
      })
    );
    formHandlers.reset();
  };
  return (
    <Block title="Add new item to share">
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "200px 60px 70px 100px",
          gap: "16px",
          alignItems: "flex-end",
        }}
        onSubmit={formHandlers.handleSubmit(handleAddItem)}
      >
        <Field
          label="Item name"
          error={errors.item}
          inputProps={{
            type: "text",
            placeholder: "Enter item name",
            ...formHandlers.register("item"),
          }}
        />
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
            min: 0,
            ...formHandlers.register("price"),
          }}
        />
        <button
          type="submit"
          className="button mb-3"
          disabled={!isValid || !isDirty}
        >
          Add item
        </button>
      </form>
    </Block>
  );
};

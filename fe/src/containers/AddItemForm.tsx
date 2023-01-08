import { Block, Field } from "../components";
import { useForm } from "react-hook-form";
import { socketClient } from "../__api__/socket";
import { useParams } from "react-router";

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
    defaultValues: {
      item: "",
      price: 0,
      amount: 1,
    },
  });
  const { isValid, isDirty } = formHandlers.formState;

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
          inputProps={{
            type: "text",
            placeholder: "Enter item name",
            ...formHandlers.register("item", { required: true }),
          }}
        />
        <Field
          label="Amount"
          inputProps={{
            type: "number",
            ...formHandlers.register("amount", {
              required: true,
              min: 1,
            }),
          }}
        />
        <Field
          label="Price"
          inputProps={{
            type: "number",
            ...formHandlers.register("price", {
              required: true,
              min: 0,
            }),
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

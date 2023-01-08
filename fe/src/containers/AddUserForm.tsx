import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Block, Field } from "../components";
import { socketClient } from "../__api__/socket";

export const AddUserForm = () => {
  const socket = socketClient.socket;
  const { partyId } = useParams();

  const formHandlers = useForm<{ user: string }>({
    defaultValues: {
      user: "",
    },
  });

  const { isValid, isDirty } = formHandlers.formState;

  const handleAddUser = ({ user }: { user: string }) => {
    socket.send(JSON.stringify({ type: "add user", user, partyId }));
    formHandlers.reset();
  };

  return (
    <Block title="You can add new participant">
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "200px 100px",
          gap: "16px",
          alignItems: "flex-end",
        }}
        onSubmit={formHandlers.handleSubmit(handleAddUser)}
      >
        <Field
          label="User name"
          inputProps={{
            type: "text",
            placeholder: "Enter user name",
            ...formHandlers.register("user", {
              required: true,
            }),
          }}
        />
        <button
          className="button mb-3"
          type="submit"
          disabled={!isValid || !isDirty}
        >
          Add user
        </button>
      </form>
    </Block>
  );
};

import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Block, Field } from "../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendEvent } from "../utils/eventHandlers";
import { addUserSchema } from "../utils/validation";

export const AddUserForm = () => {
  const { partyId } = useParams();

  const formHandlers = useForm<{ userName: string }>({
    resolver: yupResolver(addUserSchema),
    defaultValues: {
      userName: "",
    },
    mode: "all",
  });

  const { isValid, isDirty, errors } = formHandlers.formState;

  const handleAddUser = ({ userName }: { userName: string }) => {
    sendEvent({ type: "add user", userName, partyId: partyId as string });
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
          error={errors.userName}
          label="User name"
          inputProps={{
            type: "text",
            placeholder: "Enter user name",
            ...formHandlers.register("userName", {
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

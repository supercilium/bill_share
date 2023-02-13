import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Block, Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendEvent } from "../../utils/eventHandlers";
import { addUserSchema } from "../../utils/validation";
import { AddUserLayout } from "../../components/styled/addUserLayout";

export const AddUserForm = () => {
  const { partyId } = useParams();

  const formHandlers = useForm<{ userName?: string; email: string }>({
    resolver: yupResolver(addUserSchema),
    defaultValues: {
      userName: undefined,
      email: "",
    },
    mode: "all",
  });

  const { isValid, isDirty, errors } = formHandlers.formState;

  const handleAddUser = ({
    userName,
    email,
  }: {
    userName?: string;
    email: string;
  }) => {
    sendEvent({
      type: "add user",
      userName,
      email,
      partyId: partyId as string,
    });
    formHandlers.reset();
  };

  return (
    <Block>
      <p className="has-text-grey-dark is-size-5 mb-3">Add participant</p>

      <AddUserLayout onSubmit={formHandlers.handleSubmit(handleAddUser)}>
        <Field
          error={errors.email}
          label="Email"
          inputProps={{
            type: "email",
            placeholder: "Enter email",
            ...formHandlers.register("email"),
          }}
        />
        {/* <Field
          error={errors.userName}
          label="User name"
          inputProps={{
            type: "text",
            placeholder: "Enter user name",
            ...formHandlers.register("userName"),
          }}
        /> */}
        <button
          className="button mb-3"
          type="submit"
          disabled={!isValid || !isDirty}
        >
          Add user
        </button>
      </AddUserLayout>
    </Block>
  );
};

import React, { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useParams } from "react-router";
import { Columns, Field } from "../../components";
import { useUser } from "../../contexts/UserContext";
import { UserEventData } from "../../types/events";
import { User } from "../../types/user";
import { getValidationErrorsFromREsponse } from "../../services/validation";
import { ErrorRequest } from "../../__api__/helpers";
import { createUser } from "../../__api__/users";

interface JoinPartyFormInterface {
  userName: string;
}

export const JoinPartyForm: FC<{
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}> = ({ setCurrentUser }) => {
  const { partyId } = useParams();
  const { user, setUser } = useUser();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<JoinPartyFormInterface>({
    defaultValues: {
      userName: user?.name,
    },
    mode: "onBlur",
  });

  const { mutate, isLoading, error } = useMutation<
    User,
    ErrorRequest,
    UserEventData,
    unknown
  >(createUser, {
    onSuccess: (data) => {
      setCurrentUser(data);
    },
    onError: async (error) => {
      if (error.status === 401) {
        setUser(null);
      }
      if (error) {
        getValidationErrorsFromREsponse<JoinPartyFormInterface>({
          error,
          setError,
        });
      }
    },
  });

  const handleCreateUser: SubmitHandler<JoinPartyFormInterface> = async (
    values
  ) => {
    mutate({
      userId: user?.id,
      userName: values.userName || undefined,
      partyId: partyId as string,
    });
  };

  return (
    <form
      noValidate={true}
      className="container"
      onSubmit={handleSubmit(handleCreateUser)}
    >
      <h2 className="title is-2 my-5">Joining the party</h2>
      {error?.message && <p className="has-text-danger">{error.message}</p>}
      <Columns>
        <div>
          {!user && (
            <Field
              label="Enter your name"
              error={errors.userName}
              inputProps={{
                type: "text",
                ...register("userName"),
              }}
            />
          )}
          <button
            type="submit"
            className={isLoading ? "button is-loading" : "button"}
            disabled={isLoading || !isValid}
          >
            Join party
          </button>
        </div>
        <div />
      </Columns>
    </form>
  );
};

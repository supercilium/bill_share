import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import cx from "classnames";
import { useMutation } from "react-query";
import { useLocation, useParams } from "react-router";
import { Field } from "../../components";
import { useUser } from "../../contexts/UserContext";
import { User } from "../../types/user";
import { getValidationErrorsFromREsponse } from "../../services/validation";
import { ErrorRequest } from "../../__api__/helpers";
import { CreateUserDTO, createUser } from "../../__api__/users";
import { CreateGuestDTO, createGuest } from "../../__api__/guests";
import { WaitingRoom } from "../WaitingRoom";

interface JoinPartyFormInterface {
  userName: string;
}

export const GUEST_KEY = "guest";

export const JoinPartyForm: FC<{
  onSuccess: (user: User) => void;
}> = ({ onSuccess }) => {
  const { partyId } = useParams();
  const { search } = useLocation();
  const returnPath = new URLSearchParams(search).get("returnPath");
  const partyFromSearch = returnPath?.replace("/party/", "");
  const [guest, setGuest] = useState<User | null>(
    JSON.parse(window.localStorage.getItem(GUEST_KEY) ?? "{}")
  );

  const { user, setUser } = useUser();
  const [isInWaitingRoom, goToWaitingRoom] = useState<boolean>(guest !== null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<JoinPartyFormInterface>({
    defaultValues: {
      userName: user?.name ?? guest?.name ?? "",
    },
    mode: "onBlur",
  });

  const {
    mutate: mutateUser,
    isLoading,
    error,
  } = useMutation<User, ErrorRequest, CreateUserDTO, unknown>(createUser, {
    onSuccess: (data) => {
      onSuccess(data);
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

  const { mutate: mutateGuest, isLoading: isGuestLoading } = useMutation<
    User,
    ErrorRequest,
    CreateGuestDTO,
    unknown
  >(createGuest, {
    onSuccess: (data) => {
      goToWaitingRoom(true);
      setGuest(data);
      window.localStorage.setItem(GUEST_KEY, JSON.stringify(data));
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
    if (user) {
      mutateUser({
        userId: user?.id,
        userName: values.userName || undefined,
        partyId: partyId as string,
      });
    } else {
      mutateGuest({
        userName: values.userName,
        partyId: partyFromSearch as string,
      });
    }
  };

  if (isInWaitingRoom && guest?.id && partyFromSearch) {
    return (
      <WaitingRoom
        onSuccess={() => {
          window.localStorage.removeItem(GUEST_KEY);
          setUser(guest);
          setGuest(null);
          goToWaitingRoom(false);
        }}
        userId={guest.id}
        partyId={partyFromSearch}
      />
    );
  }

  return (
    <form
      noValidate={true}
      className="container"
      onSubmit={handleSubmit(handleCreateUser)}
    >
      {error?.message && <p className="has-text-danger">{error.message}</p>}
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
        className={cx("button", { "is-loading": isLoading })}
        disabled={isLoading || !isValid || isGuestLoading}
      >
        Join party
      </button>
    </form>
  );
};

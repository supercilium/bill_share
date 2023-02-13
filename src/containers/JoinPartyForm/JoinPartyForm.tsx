import React, { FC, useState } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router";
import { useUser } from "../../contexts/UserContext";
import { UserEventData } from "../../types/events";
import { User } from "../../types/user";
import { createUser } from "../../__api__/party";

export const JoinPartyForm: FC<{
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}> = ({ setCurrentUser }) => {
  const { partyId } = useParams();
  const { user, setUser } = useUser();

  const [userName, setUserName] = useState<string | undefined>();
  const { mutate, isLoading } = useMutation<
    User,
    Response,
    UserEventData,
    unknown
  >(createUser, {
    onSuccess: (data) => {
      setCurrentUser(data);
    },
    onError: (error) => {
      if (error.status === 401) {
        setUser(null);
      }
      // const message = getErrorMessage(error);
      // setFormError(message);
    },
  });

  const handleCreateUser = async () => {
    mutate({
      userId: user?.id,
      userName: userName || undefined,
      partyId: partyId as string,
    });
  };

  return (
    <div className="container">
      <h2 className="title is-2 my-5">Joining the party</h2>
      {!user && (
        <div className="field">
          <label htmlFor="username" className="label">
            Enter your name
          </label>
          <input
            className="input"
            type="text"
            name="username"
            value={userName}
            onChange={({ target }) => setUserName(target.value)}
          />
        </div>
      )}
      <button
        type="submit"
        className={isLoading ? "button is-loading" : "button"}
        onClick={() => handleCreateUser()}
        disabled={isLoading}
      >
        Join party
      </button>
    </div>
  );
};

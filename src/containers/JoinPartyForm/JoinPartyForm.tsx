import React, { FC, useState } from "react";
import { useParams } from "react-router";
import { User } from "../../types/user";
import { createUser } from "../../__api__/party";

export const JoinPartyForm: FC<{
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}> = ({ setCurrentUser }) => {
  const { partyId } = useParams();

  const [userName, setUserName] = useState<string | undefined>();
  const handleCreateUser = async () => {
    const response = await createUser({ userName, partyId: partyId as string });

    if ("error" in response) {
      console.log(response.error);
      return;
    }
    // localStorage.setItem("user", JSON.stringify(response));
    setCurrentUser(response);
  };

  return (
    <div className="container">
      <h2 className="title is-2 my-5">Enter your name</h2>
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
      <button
        type="submit"
        className="button"
        onClick={() => handleCreateUser()}
      >
        Join party
      </button>
    </div>
  );
};

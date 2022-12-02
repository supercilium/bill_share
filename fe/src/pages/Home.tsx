import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PartyInterface } from "../types/party";
import { createParty, getParties, putPartyById } from "../__api__/party";

export const Home = () => {
  const [parties, setParties] = useState<PartyInterface[]>([]);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const getPartyList = async () => {
    try {
      const parties = await getParties();
      setParties(parties as PartyInterface[]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPartyList();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await createParty({ userName });
    if ("partyId" in response) {
      navigate(`/party/${response?.partyId}`);
    }
  };

  const handleClick = async (id: string) => {
    await putPartyById(id, { userName });
    navigate(`/party/${id}`);
  };

  return (
    <div className="App">
      <header className="App-header">Party for everybody</header>
      <form
        id="start-new-party"
        className="mt-5"
        action=""
        onSubmit={(e) => handleSubmit(e)}
      >
        <h2>Create your party</h2>
        <label className="label">
          Enter your name
          <input
            className="input"
            type="text"
            name="username"
            value={userName}
            onChange={({ target }) => setUserName(target.value)}
          />
        </label>
        <button type="submit" className="button">
          Start party
        </button>
        {parties?.length > 0 && (
          <>
            <h2>... or join existing</h2>
            {parties.map(({ id, name, master }) => (
              <button
                key={id}
                type="button"
                className="button"
                onClick={() => handleClick(id)}
              >
                {name}
              </button>
            ))}
          </>
        )}
      </form>
    </div>
  );
};

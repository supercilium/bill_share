import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PartyInterface } from "../types/party";
import { createParty, getParties, putPartyById } from "../__api__/party";

export const Home = () => {
  const [parties, setParties] = useState<PartyInterface[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [partyName, setPartyName] = useState<string>("");
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
    const response = await createParty({ userName, partyName });
    if ("partyId" in response) {
      navigate(`/party/${response?.partyId}`);
    }
  };

  const handleClick = async (id: string) => {
    await putPartyById(id, { userName });
    navigate(`/party/${id}`);
  };

  return (
    <div className="container">
      <header className="App-header my-5">
        <h1 className="title is-1">Party for everybody</h1>
      </header>
      <form
        id="start-new-party"
        className="mt-5"
        action=""
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="columns">
          <div className="block column">
            <h2 className="title is-3 my-2">Create your party</h2>
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
            <div className="field">
              <label htmlFor="partyName" className="label">
                Enter your party name
              </label>
              <input
                className="input"
                type="text"
                name="partyName"
                value={partyName}
                onChange={({ target }) => setPartyName(target.value)}
              />
            </div>
            <button type="submit" className="button">
              Start party
            </button>
          </div>
          <div className="column" />
        </div>
        {parties?.length > 0 && (
          <div className="block">
            <h2 className="title is-3 mt-2 mb-6">... or join existing</h2>
            {parties.map(({ id, name, master }) => (
              <button
                key={id}
                type="button"
                className="button"
                onClick={() => handleClick(id)}
              >
                {name || "click me"}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

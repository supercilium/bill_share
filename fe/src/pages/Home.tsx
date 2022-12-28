import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Field, Footer, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { PartyInterface } from "../types/party";
import { createParty, getParties, putPartyById } from "../__api__/party";

interface CreatePartyInterface {
  partyName: string;
  userName: string;
}

export const Home = () => {
  const [parties, setParties] = useState<PartyInterface[]>([]);
  const { register, handleSubmit, watch } = useForm<CreatePartyInterface>();
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

  const onSubmit: SubmitHandler<CreatePartyInterface> = async (data) => {
    const response = await createParty(data);
    if ("id" in response) {
      localStorage.setItem("user", JSON.stringify(response.owner));
      navigate(`/party/${response?.id}`);
    }
  };

  const handleClick = async (id: string) => {
    const userName = watch("userName");
    await putPartyById(id, { userName });
    navigate(`/party/${id}`);
  };

  return (
    <PlainLayout
      Header={
        <Header>
          <h1 className="title is-1">Party for everybody</h1>
        </Header>
      }
      Footer={<Footer>foo-footer</Footer>}
      Main={
        <Main>
          <form
            id="start-new-party"
            className="mt-5"
            action=""
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="columns">
              <div className="block column">
                <h2 className="title is-3 my-2">Create your party</h2>
                <Field
                  label="Enter your name"
                  inputProps={{ type: "text", ...register("userName") }}
                />
                <Field
                  label="Enter your party name"
                  inputProps={{ type: "text", ...register("partyName") }}
                />
                <button type="submit" className="button">
                  Start party
                </button>
              </div>
              <div className="column" />
            </div>
            {parties?.length > 0 && (
              <div className="block">
                <h2 className="title is-3 mt-2 mb-6">... or join existing</h2>
                {parties.map(({ id, name }) => (
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
        </Main>
      }
    />
  );
};

Home.whyDidYouRender = true;

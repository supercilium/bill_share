import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Field, Footer, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { createParty } from "../__api__/party";

interface CreatePartyInterface {
  partyName: string;
  userName: string;
}

export const Home = () => {
  const { register, handleSubmit } = useForm<CreatePartyInterface>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CreatePartyInterface> = async (data) => {
    const response = await createParty(data);
    if ("id" in response) {
      localStorage.setItem("user", JSON.stringify(response.owner));
      navigate(`/party/${response?.id}`);
    }
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
          </form>
        </Main>
      }
    />
  );
};

Home.whyDidYouRender = true;

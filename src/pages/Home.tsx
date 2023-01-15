import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Field, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { createParty } from "../__api__/party";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface CreatePartyInterface {
  partyName: string;
  userName: string;
}

const schema = yup
  .object({
    userName: yup.string().required(),
    partyName: yup.string().required(),
  })
  .required();

export const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<CreatePartyInterface>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CreatePartyInterface> = async (data) => {
    if (!isValid) {
      return;
    }
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
                  error={errors.userName}
                  inputProps={{ type: "text", ...register("userName") }}
                />
                <Field
                  label="Enter your party name"
                  error={errors.partyName}
                  inputProps={{ type: "text", ...register("partyName") }}
                />
                <button
                  type="submit"
                  className="button"
                  disabled={!isValid || !isDirty}
                >
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

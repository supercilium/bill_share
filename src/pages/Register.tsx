import { SubmitHandler, useForm } from "react-hook-form";
// import { useNavigate } from "react-router";
import { Field, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RegisterInterface } from "../types/user";
import { fetchRegister } from "../__api__/auth";

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterInterface>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  // const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    const response = await fetchRegister(data);
    console.log(response);
    if ("token" in response) {
      localStorage.setItem("token", JSON.stringify(response.token));
    }
  };

  return (
    <PlainLayout
      Header={
        <Header>
          <h1 className="title is-1">Register</h1>
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
                <h2 className="title is-3 my-2">Create user</h2>
                <Field
                  label="Enter your name"
                  error={errors.name}
                  inputProps={{ type: "text", ...register("name") }}
                />
                <Field
                  label="Enter your email"
                  error={errors.email}
                  inputProps={{ type: "email", ...register("email") }}
                />
                <Field
                  label="Enter your password"
                  inputProps={{ type: "password", ...register("password") }}
                />
                <button
                  type="submit"
                  className="button"
                  disabled={!isValid || !isDirty}
                >
                  Register
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

Register.whyDidYouRender = true;
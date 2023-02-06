import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoginInterface } from "../../types/user";
import { fetchLogin } from "../../__api__/auth";
import { USER_KEY, useUser } from "../../contexts/UserContext";

interface LoginFormProps {}

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

export const LoginForm: FC<LoginFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginInterface>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const { setUser } = useUser();

  const onSubmit: SubmitHandler<LoginInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    const response = await fetchLogin(data);
    console.log(response);
    if ("token" in response) {
      setUser(response);
      localStorage.setItem(USER_KEY, JSON.stringify(response));
    }
  };

  return (
    <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="block">
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
          Log in
        </button>
      </div>
    </form>
  );
};

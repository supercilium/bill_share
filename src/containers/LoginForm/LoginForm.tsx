import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginInterface } from "../../types/user";
import { fetchLogin } from "../../__api__/auth";
import { useUser } from "../../contexts/UserContext";
import { loginSchema } from "../../utils/validation";

interface LoginFormProps {
  onLogin?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginInterface>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });
  const { setUser } = useUser();

  const onSubmit: SubmitHandler<LoginInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    const response = await fetchLogin(data);
    if ("id" in response) {
      setUser(response);
      onLogin?.();
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
          inputProps={{
            type: "password",
            autoComplete: "current-password",
            ...register("password"),
          }}
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

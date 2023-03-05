import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginInterface, User } from "../../types/user";
import { fetchLogin } from "../../__api__/auth";
import { useUser } from "../../contexts/UserContext";
import {
  getValidationErrorsFromREsponse,
  loginSchema,
} from "../../utils/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";

interface LoginFormProps {
  onLogin?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onLogin }) => {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginInterface>({
    resolver: yupResolver(loginSchema),
    mode: "all",
  });
  const { setUser } = useUser();
  const { mutate, isLoading, error } = useMutation<
    User,
    ErrorRequest,
    LoginInterface,
    unknown
  >(fetchLogin, {
    onSuccess: (data) => {
      onLogin?.();
      setUser && setUser(data);
    },
    onError: async (error) => {
      if (error.status === 401) {
        setUser(null);
      }
      if (error) {
        getValidationErrorsFromREsponse<LoginInterface>({ error, setError });
      }
    },
  });
  const onSubmit: SubmitHandler<LoginInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    mutate(data);
  };

  return (
    <form noValidate={true} id="login-form" onSubmit={handleSubmit(onSubmit)}>
      {error?.message && <p className="has-text-danger">{error.message}</p>}
      <div className="block">
        <Field
          label="Enter your email"
          error={errors.email}
          inputProps={{
            type: "email",
            autoComplete: "email",
            ...register("email"),
          }}
        />
        <Field
          label="Enter your password"
          error={errors.password}
          inputProps={{
            type: "password",
            autoComplete: "current-password",
            ...register("password"),
          }}
        />
        <button
          type="submit"
          className={isLoading ? "button is-loading" : "button"}
          disabled={!isValid || !isDirty || isLoading}
        >
          Log in
        </button>
      </div>
    </form>
  );
};

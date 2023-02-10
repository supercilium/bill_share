import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginInterface, RegisterInterface, User } from "../../types/user";
import { fetchRegister } from "../../__api__/auth";
import { useUser } from "../../contexts/UserContext";
import { signInSchema } from "../../utils/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";

interface RegisterFormProps {
  onRegister?: () => void;
}

export const RegisterForm: FC<RegisterFormProps> = ({ onRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterInterface>({
    resolver: yupResolver(signInSchema),
    mode: "onBlur",
  });
  const { setUser } = useUser();
  const { mutate, isLoading } = useMutation<
    User,
    ErrorRequest,
    LoginInterface,
    unknown
  >(fetchRegister, {
    onSuccess: (data) => {
      onRegister?.();
      setUser && setUser(data);
    },
    onError: (error) => {
      console.log(error);
      // const message = getErrorMessage(error);
      // setFormError(message);
    },
  });

  const onSubmit: SubmitHandler<RegisterInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    mutate(data);
  };

  return (
    <form id="register-form" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="block">
        <Field
          label="Enter your name"
          error={errors.name}
          inputProps={{ type: "text", ...register("name") }}
        />
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
          Register
        </button>
      </div>
    </form>
  );
};

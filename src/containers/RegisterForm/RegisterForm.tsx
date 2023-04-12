import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterInterface, User } from "../../types/user";
import { fetchRegister } from "../../__api__/auth";
import { useUser } from "../../contexts/UserContext";
import {
  getValidationErrorsFromREsponse,
  signInSchema,
} from "../../services/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { useNotifications } from "../../contexts/NotificationContext";

interface RegisterFormProps {
  onRegister?: () => void;
}

export const RegisterForm: FC<RegisterFormProps> = ({ onRegister }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterInterface>({
    resolver: yupResolver(signInSchema),
    mode: "all",
  });
  const { setUser } = useUser();
  const { addAlert } = useNotifications();
  const { mutate, isLoading, error } = useMutation<
    User,
    ErrorRequest,
    RegisterInterface,
    unknown
  >(fetchRegister, {
    onSuccess: (data) => {
      onRegister?.();
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      window.requestAnimationFrame(() => {
        document
          .querySelector("meta[name='_csrf_header']")
          ?.setAttribute("content", token);
      });

      setUser && setUser(data);
      addAlert({
        mode: "success",
        text: `Confirm that this is your email address to keep your account secure. We've just sent you an email.`,
        // TODO: need to create profile first
        // You can resend confirmation email from your profile
      });
    },
    onError: async (error) => {
      if (error.status === 401) {
        setUser(null);
      }
      if (error) {
        getValidationErrorsFromREsponse<RegisterInterface>({ error, setError });
      }
    },
  });

  const onSubmit: SubmitHandler<RegisterInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    mutate(data);
  };

  return (
    <form
      noValidate={true}
      id="register-form"
      className="mt-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error?.message && <p className="has-text-danger">{error.message}</p>}
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

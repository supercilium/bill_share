import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotPasswordInterface } from "../../types/user";
import { forgotPassword } from "../../__api__/auth";
import {
  forgotPasswordSchema,
  getValidationErrorsFromREsponse,
} from "../../services/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { useNavigate } from "react-router";

interface ForgotPasswordFormProps {
  onReturn: () => void;
}

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  onReturn,
}) => {
  const navigate = useNavigate();
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<ForgotPasswordInterface>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "all",
  });
  const { mutate, isLoading, error } = useMutation<
    void,
    ErrorRequest,
    ForgotPasswordInterface,
    unknown
  >(forgotPassword, {
    onSuccess: () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      window.requestAnimationFrame(() => {
        document
          .querySelector("meta[name='_csrf_header']")
          ?.setAttribute("content", token);
      });

      navigate("/reset-password");
    },
    onError: async (error) => {
      if (error) {
        getValidationErrorsFromREsponse<ForgotPasswordInterface>({
          error,
          setError,
        });
      }
    },
  });
  const onSubmit: SubmitHandler<ForgotPasswordInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    mutate(data);
  };

  return (
    <form
      noValidate={true}
      id="forgot-password-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="title is-4">Password resetting</p>
      {error?.message && <p className="has-text-danger">{error.message}</p>}
      <div className="block">
        <Field
          label="Enter your email address to reset a password"
          error={errors.email}
          inputProps={{
            type: "email",
            autoComplete: "email",
            ...register("email"),
          }}
        />
        <div>
          <button
            type="submit"
            className={isLoading ? "button is-loading" : "button"}
            disabled={!isValid || !isDirty || isLoading}
          >
            Submit
          </button>
          <button
            onClick={onReturn}
            type="button"
            className="button is-ghost ml-4"
          >
            Back to Log in
          </button>
        </div>
      </div>
    </form>
  );
};

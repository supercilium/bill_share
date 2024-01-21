import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginInterface } from "../../types/user";
import { fetchLogin } from "../../__api__/auth";
import { useUser } from "../../contexts/UserContext";
import {
  getValidationErrorsFromREsponse,
  loginSchema,
} from "../../services/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { ForgotPasswordForm } from "../ForgotPasswordForm";
import { setXSRF } from "../../utils/cookie";

interface LoginFormProps {
  onLogin?: () => void;
  closePopup?: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onLogin, closePopup }) => {
  const { t } = useTranslation();

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginInterface>({
    resolver: yupResolver(loginSchema),
    mode: "all",
  });
  const { setUser, refetch } = useUser();
  const [hasForgotPassword, setHasForgotPassword] = useState(false);
  const { mutate, isLoading, error } = useMutation<
    void,
    ErrorRequest,
    LoginInterface,
    unknown
  >(fetchLogin, {
    onSuccess: () => {
      onLogin?.();
      setXSRF();
      refetch();
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

  if (hasForgotPassword) {
    return (
      <ForgotPasswordForm
        closePopup={closePopup}
        onReturn={() => setHasForgotPassword(false)}
      />
    );
  }

  return (
    <form noValidate={true} id="login-form" onSubmit={handleSubmit(onSubmit)}>
      {error?.message && <p className="has-text-danger">{error.message}</p>}
      <div className="block">
        <Field
          label={t("LABEL_EMAIL")}
          error={errors.email}
          inputProps={{
            type: "email",
            autoComplete: "email",
            ...register("email"),
          }}
        />
        <Field
          label={t("LABEL_PASSWORD")}
          error={errors.password}
          inputProps={{
            type: "password",
            autoComplete: "current-password",
            ...register("password"),
          }}
        />
        <div>
          <button
            type="submit"
            className={cx("button", { "is-loading": isLoading })}
            disabled={!isValid || !isDirty || isLoading}
          >
            {t("BUTTON_LOG_IN")}
          </button>
          <button
            onClick={() => setHasForgotPassword(true)}
            type="button"
            className="button is-ghost ml-4"
          >
            {t("BUTTON_FORGOT_PASSWORD")}
          </button>
        </div>
      </div>
    </form>
  );
};

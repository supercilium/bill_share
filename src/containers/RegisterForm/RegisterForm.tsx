import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import cx from "classnames";
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
import { setXSRF } from "../../utils/cookie";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { mutate, isLoading, error } = useMutation<
    User,
    ErrorRequest,
    RegisterInterface,
    unknown
  >(fetchRegister, {
    onSuccess: (data) => {
      onRegister?.();
      setXSRF();

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
          label={t("LABEL_FIRST_NAME")}
          error={errors.name}
          inputProps={{ type: "text", ...register("name") }}
        />
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
        <button
          type="submit"
          className={cx("button", { "is-loading": isLoading })}
          disabled={!isValid || !isDirty || isLoading}
        >
          {t("BUTTON_REGISTER")}
        </button>
      </div>
    </form>
  );
};

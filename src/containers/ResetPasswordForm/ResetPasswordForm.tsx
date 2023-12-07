import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import cx from "classnames";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasswordInterface, User } from "../../types/user";
import { resetPassword, ResetPasswordDTO } from "../../__api__/auth";
import {
  getValidationErrorsFromREsponse,
  resetPasswordSchema,
} from "../../services/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { Loader } from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { setXSRF } from "../../utils/cookie";
import { useTranslation } from "react-i18next";

interface RegisterFormProps {
  code?: string;
}

export const ResetPasswordForm: FC<RegisterFormProps> = ({ code }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { addAlert } = useNotifications();
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<ResetPasswordInterface>({
    defaultValues: {
      code,
    },
    resolver: yupResolver(resetPasswordSchema),
    mode: "all",
  });

  const { status, mutate, isLoading, error } = useMutation<
    User,
    ErrorRequest,
    ResetPasswordDTO,
    unknown
  >(resetPassword, {
    onSuccess: (data) => {
      setXSRF();
      setUser(data);
      addAlert({
        mode: "success",
        text: t("ALERT_PASSWORD_RESET"),
      });
      navigate("/dashboard");
    },
    onError: async (error) => {
      if (error) {
        getValidationErrorsFromREsponse<ResetPasswordInterface>({
          error,
          setError,
        });
      }
    },
  });
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<ResetPasswordInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    const { passwordConfirmation, ...input } = data;
    mutate(input);
  };

  if (status === "loading") {
    return (
      <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
        <Loader />
      </div>
    );
  }

  return (
    <form
      noValidate={true}
      id="reset-password-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && (
        <p className="has-text-danger">
          {error.message || t("ERROR_DEFAULT_TITLE")}
        </p>
      )}
      <div className="block">
        <Field
          label={t("LABEL_PASSWORD_NEW")}
          error={errors.password}
          inputProps={{
            type: "password",
            autoComplete: "password",
            ...register("password"),
          }}
        />
        <Field
          label={t("LABEL_PASSWORD_CONFIRM")}
          error={errors.passwordConfirmation}
          inputProps={{
            type: "password",
            autoComplete: "password",
            ...register("passwordConfirmation"),
          }}
        />
        <div>
          <button
            type="submit"
            className={cx("button", { "is-loading": isLoading })}
            disabled={!isValid || !isDirty || isLoading}
          >
            {t("BUTTON_SUBMIT")}
          </button>
        </div>
      </div>
    </form>
  );
};

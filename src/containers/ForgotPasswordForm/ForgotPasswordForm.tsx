import { FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import cx from "classnames";
import { ForgotPasswordInterface } from "../../types/user";
import { forgotPassword } from "../../__api__/auth";
import {
  forgotPasswordSchema,
  getValidationErrorsFromREsponse,
} from "../../services/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { useNavigate } from "react-router";
import { setXSRF } from "../../utils/cookie";
import { getTime } from "../../utils/time";
import { useTranslation } from "react-i18next";

interface ForgotPasswordFormProps {
  onReturn: () => void;
  closePopup?: () => void;
}

const TIMEOUT_BETWEEN_ATTEMPTS = 1000 * 60 * 2;

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  onReturn,
  closePopup,
}) => {
  const navigate = useNavigate();
  const {
    setError,
    register,
    handleSubmit,
    watch,
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
      setXSRF();
      closePopup?.();
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
  const timeout = useRef<number>();
  const [blockedTime, setBlockedTime] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (blockedTime === 0) {
      clearInterval(timeout.current);
    }
  }, [blockedTime]);

  const { email } = watch();
  useEffect(() => {
    if (blockedTime) {
      setBlockedTime(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const onSubmit: SubmitHandler<ForgotPasswordInterface> = async (data) => {
    if (!isValid || blockedTime) {
      return;
    }
    setBlockedTime(TIMEOUT_BETWEEN_ATTEMPTS);
    timeout.current = window.setInterval(() => {
      setBlockedTime((prev) => prev - 1000);
    }, 1000);

    mutate(data);
  };

  return (
    <form
      noValidate={true}
      id="forgot-password-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="title is-4">{t("TITLE_RESET_PASSWORD")}</p>
      {error?.message && <p className="has-text-danger">{error.message}</p>}
      <div className="block">
        <Field
          label={t("LABEL_RESET_PASSWORD_EMAIL")}
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
            className={cx("button", {
              "is-loading": isLoading,
              "is-disabled": blockedTime,
            })}
            disabled={!isValid || !isDirty || isLoading || blockedTime > 0}
          >
            {blockedTime ? getTime(blockedTime) : t("BUTTON_SUBMIT")}
          </button>
          <button
            onClick={onReturn}
            type="button"
            className="button is-ghost ml-4"
          >
            {t("BUTTON_BACK_TO_LOGIN")}
          </button>
        </div>
      </div>
    </form>
  );
};

import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import cx from "classnames";
import { ChangePasswordDTO } from "../../types/user";
import { useUser } from "../../contexts/UserContext";
import {
  changePasswordSchema,
  getValidationErrorsFromREsponse,
} from "../../services/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { setXSRF } from "../../utils/cookie";
import { ChangePasswordFormInterface } from "../../types/user";
import { changePassword } from "../../__api__/users";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

interface ChangePasswordFormProps {}

export const ChangePasswordForm: FC<ChangePasswordFormProps> = () => {
  const navigate = useNavigate();
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<ChangePasswordFormInterface>({
    resolver: yupResolver(changePasswordSchema),
    mode: "all",
  });
  const { setUser } = useUser();
  const { mutate, isLoading, error } = useMutation<
    void,
    ErrorRequest,
    ChangePasswordDTO,
    unknown
  >(changePassword, {
    onSuccess: (data) => {
      setXSRF();
      navigate("/profile");
    },
    onError: async (error) => {
      if (error.status === 401) {
        setUser(null);
      }
      if (error) {
        getValidationErrorsFromREsponse<ChangePasswordFormInterface>({
          error,
          setError,
        });
      }
    },
  });
  const onSubmit: SubmitHandler<ChangePasswordFormInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    mutate({ oldPassword: data.oldPassword, newPassword: data.newPassword });
  };
  const { t } = useTranslation();

  return (
    <form
      noValidate={true}
      id="change-password-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error?.message && <p className="has-text-danger">{error.message}</p>}
      <div className="block">
        <Field
          label={t("LABEL_PASSWORD")}
          error={errors.oldPassword}
          inputProps={{
            type: "password",
            autoComplete: "password",
            ...register("oldPassword"),
          }}
        />
        <Field
          label={t("LABEL_PASSWORD_NEW")}
          error={errors.newPassword}
          inputProps={{
            type: "password",
            autoComplete: "password",
            ...register("newPassword"),
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
            {t("BUTTON_CHANGE_PASSWORD")}
          </button>
        </div>
      </div>
    </form>
  );
};

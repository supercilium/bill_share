import { FC } from "react";
import { createParty } from "../../__api__/parties";
import { yupResolver } from "@hookform/resolvers/yup";
import cx from "classnames";
import { CreatePartyInterface, PartyInterface } from "../../types/party";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Field } from "../../components";
import { useUser } from "../../contexts/UserContext";
import {
  createPartySchema,
  getValidationErrorsFromREsponse,
} from "../../services/validation";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { sortPartyUsers } from "../../utils/sort";
import { useTranslation } from "react-i18next";

interface CreatePartyFormProps {}

export const CreatePartyForm: FC<CreatePartyFormProps> = (props) => {
  const { user, setUser } = useUser();
  const { id } = user || {};
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<CreatePartyInterface>({
    defaultValues: {
      // userName: name,
      id,
    },
    resolver: yupResolver(createPartySchema),
    mode: "all",
  });
  const navigate = useNavigate();
  const { mutate, isLoading, error } = useMutation<
    PartyInterface,
    ErrorRequest,
    CreatePartyInterface,
    unknown
  >(
    (data) =>
      createParty(data).then((result) => {
        const party = sortPartyUsers(result, user?.id || "");
        return Promise.resolve(party);
      }),
    {
      onSuccess: (data) => {
        navigate(`/party/${data?.id}`);
      },
      onError: async (error) => {
        if (error.status === 401) {
          setUser(null);
        }
        if (error) {
          getValidationErrorsFromREsponse<CreatePartyInterface>({
            error,
            setError,
          });
        }
      },
    }
  );
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<CreatePartyInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    mutate(data);
  };

  return (
    <form
      id="start-new-party"
      className="mt-5"
      action=""
      noValidate={true}
      onSubmit={handleSubmit(onSubmit)}
    >
      {error?.message && <p className="has-text-danger">{error.message}</p>}
      <div className="block">
        <h2 className="title is-3 my-2">{t("TITLE_CREATE_PARTY")}</h2>
        {/* Field for /party/temporary creation */}
        {/* <Field
          label="Enter your name"
          error={errors.userName}
          inputProps={{ type: "text", ...register("userName") }}
        /> */}
        <Field
          label={t("LABEL_PARTY_NAME")}
          error={errors.partyName}
          inputProps={{
            type: "text",
            autoComplete: "party name",
            ...register("partyName"),
          }}
        />
        <button
          type="submit"
          className={cx("button", { "is-loading": isLoading })}
          disabled={!isValid || !isDirty || isLoading}
        >
          {t("BUTTON_START_PARTY")}
        </button>
      </div>
    </form>
  );
};

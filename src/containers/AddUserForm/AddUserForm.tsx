import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Block, Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Transport } from "../../services/transport";
import { addUserSchema } from "../../services/validation";
import "./AddUserForm.scss";
import { useTranslation } from "react-i18next";

export const AddUserForm = () => {
  const { partyId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};

  const formHandlers = useForm<{
    identifier: string;
    isUserRegistered: boolean;
  }>({
    resolver: yupResolver(addUserSchema),
    defaultValues: {
      identifier: undefined,
      isUserRegistered: true,
    },
    mode: "all",
  });
  const { t } = useTranslation();

  const { isValid, isDirty, errors } = formHandlers.formState;
  const isUserRegistered = formHandlers.watch("isUserRegistered");
  const handleAddUser = ({ identifier }: { identifier: string }) => {
    Transport.sendEvent({
      type: isUserRegistered ? "add user" : "add pseudo user",
      currentUser: currentUser.id,
      userName: isUserRegistered ? undefined : identifier,
      email: isUserRegistered ? identifier : undefined,
      partyId: partyId as string,
    });
    formHandlers.reset();
  };

  return (
    <Block>
      <p className="has-text-grey-dark is-size-5 mb-3">{t("TITLE_ADD_USER")}</p>
      <Field
        label={t("LABEL_USER_REGISTERED")}
        inputProps={{
          type: "checkbox",
          ...formHandlers.register("isUserRegistered"),
        }}
      />
      <form
        className="add-user-layout"
        noValidate={true}
        onSubmit={formHandlers.handleSubmit(handleAddUser)}
      >
        <Field
          error={errors.identifier}
          label={isUserRegistered ? "Email" : "Name"}
          onEnter={formHandlers.handleSubmit(handleAddUser)}
          inputProps={{
            type: isUserRegistered ? "email" : "text",
            placeholder: isUserRegistered ? t("LABEL_EMAIL") : t("LABEL_NAME"),
            ...formHandlers.register("identifier"),
          }}
        />
        <button
          className="button mb-3"
          type="submit"
          disabled={!isValid || !isDirty}
        >
          {t("BUTTON_ADD_USER")}
        </button>
      </form>
    </Block>
  );
};

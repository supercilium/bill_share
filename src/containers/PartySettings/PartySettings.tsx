import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Block, Columns, Field } from "../../components";
import { FormSettings } from "../../contexts/PartySettingsContext";
import {
  IS_PARTY_HINTS_HIDDEN,
  useUISettings,
} from "../../contexts/UIsettings";
import { PartyInterface } from "../../types/party";
import { Transport } from "../../services/transport";
import { AddUserForm } from "../AddUserForm";
import "./PartySettings.scss";
import { useTranslation } from "react-i18next";

export const PartySettings: FC<{ party: PartyInterface }> = ({ party }) => {
  const handlers = useFormContext<FormSettings>();
  const { areHintsVisible, setHintsVisibility, setAsideVisibility } =
    useUISettings();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};
  const { t } = useTranslation();

  const total = handlers.watch("total");
  const isPercentage = handlers.watch("isPercentage");
  const discountHandlers = handlers.register("discount", { max: total });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAsideVisibility(false);
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateDiscount = async () => {
    Transport.sendEvent({
      type: "update discount",
      partyId: party.id,
      discount: handlers.getValues("discount") || 0,
      isPercentage: handlers.getValues("isPercentage"),
      currentUser: currentUser.id,
    });
  };
  const handleRemoveUser = (userId: string) => {
    Transport.sendEvent({
      type: "remove user",
      userId,
      partyId: party.id,
      currentUser: currentUser.id,
    });
  };
  const handleSubmitDiscount = () => {
    const values = handlers.getValues();
    let { discountPercent, discount, isPercentage } = values;
    if (total && !handlers.formState.errors.discount) {
      discountPercent = isPercentage
        ? discount
        : Number((((discount || 0) * 100) / +total).toFixed(13));
      handlers.setValue("discountPercent", discountPercent);
    }

    return handleUpdateDiscount();
  };

  const header = (
    <div className="is-flex mb-5 is-justify-content-space-between is-align-items-flex-start">
      <div className="is-flex settings-header">
        <span className="mr-5">{t("TITLE_PARTY_SETTINGS")}</span>
        <Field
          label={t("LABEL_SHOW_HINTS")}
          inputProps={{
            type: "checkbox",
            checked: areHintsVisible,
            onChange: (e) => {
              if (!e.target.checked) {
                localStorage.setItem(IS_PARTY_HINTS_HIDDEN, "HIDDEN");
              } else {
                localStorage.removeItem(IS_PARTY_HINTS_HIDDEN);
              }
              setHintsVisibility(e.target.checked);
              return Promise.resolve(false);
            },
          }}
        />
      </div>
      <button
        className="button icon"
        onClick={() => setAsideVisibility((prev) => !prev)}
        aria-label="close"
      >
        <FontAwesomeIcon icon="xmark" />
      </button>
    </div>
  );

  return (
    <div className="box settings-root">
      <Block title={header}>
        <Columns containerProps={{ className: "settings-columns" }}>
          <div>
            <Block>
              <p className="has-text-grey-dark is-size-5 mb-3">
                {t("TITLE_VISIBILITY_SETTINGS")}
              </p>
              {areHintsVisible && (
                <article className="message">
                  <div className="message-body">{t("HINT_VISIBILITY")}</div>
                </article>
              )}

              <Field
                label={t("LABEL_SHOW_DISCOUNT")}
                inputProps={{
                  type: "checkbox",
                  ...handlers.register("isDiscountVisible"),
                }}
              />
              <Field
                label={t("LABEL_SHOW_SHARED")}
                inputProps={{
                  type: "checkbox",
                  ...handlers.register("isEquallyVisible"),
                }}
              />

              {areHintsVisible && (
                <article className="message">
                  <div className="message-body">{t("HINT_SHARED")}</div>
                </article>
              )}
            </Block>
            <Block>
              <p className="has-text-grey-dark is-size-5 mb-3">
                {t("TITLE_VIEW")}
              </p>
              {areHintsVisible && (
                <article className="message">
                  <div className="message-body">{t("HINT_VIEW")}</div>
                </article>
              )}

              <Field
                labels={[t("LABEL_USER_VIEW"), t("LABEL_PARTY_VIEW")]}
                inputProps={{
                  type: "radio",
                  value: ["user", "party"],
                  ...handlers.register("view"),
                }}
              />
            </Block>
          </div>
          <div>
            <Block>
              <AddUserForm />
            </Block>
            {party.users ? (
              <Block>
                <p className="has-text-grey-dark is-size-5 mb-3">
                  {t("TITLE_USERS_IN_PARTY")}
                </p>
                {Object.values(party.users).map((user) => (
                  <p
                    key={user.id}
                    className="is-size-4 is-flex is-align-items-center"
                  >
                    {user.name}{" "}
                    {user.id !== party.owner.id ? (
                      <button
                        type="button"
                        className="delete ml-2"
                        onClick={() => handleRemoveUser(user.id)}
                      ></button>
                    ) : (
                      <span
                        className="ml-2 icon has-text-grey-light"
                        title={t("PARTY_MASTER_HOVER")}
                      >
                        <FontAwesomeIcon icon="crown" />
                      </span>
                    )}
                  </p>
                ))}
              </Block>
            ) : null}
          </div>
        </Columns>
        <Columns
          columnProps={{ className: "is-two-thirds" }}
          containerProps={{ className: "mb-0" }}
        >
          <div>
            <p className="has-text-grey-dark is-size-5 mb-0">
              {t("TITLE_DISCOUNTS_TIPS")}
            </p>
            {areHintsVisible && (
              <article className="message">
                <div className="message-body">{t("HINT_DISCOUNT")}</div>
              </article>
            )}
          </div>
        </Columns>
        <Columns columnProps={{ className: "is-narrow" }}>
          <div>
            <label htmlFor="discount" className="label">
              {isPercentage
                ? t("LABEL_DISCOUNT_VALUE_PERCENT")
                : t("LABEL_DISCOUNT_VALUE_ABSOLUTE")}
            </label>
            <div className="field has-addons">
              <div className="control is-flex-grow-1">
                <input
                  id="discount"
                  className={
                    handlers.formState.errors.discount
                      ? "input is-danger"
                      : "input"
                  }
                  type="number"
                  placeholder="0"
                  min={0}
                  max={total}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmitDiscount();
                    }
                  }}
                  {...discountHandlers}
                />
              </div>
              <div className="control">
                <button
                  disabled={!!handlers.formState.errors.discount}
                  onClick={handleSubmitDiscount}
                  className="button is-info"
                >
                  <FontAwesomeIcon icon="check" />
                </button>
              </div>
            </div>
            <Field
              label={t("LABEL_DISCOUNT_TYPE")}
              inputProps={{
                type: "checkbox",
                ...handlers.register("isPercentage"),
              }}
            />
          </div>
        </Columns>
      </Block>
    </div>
  );
};

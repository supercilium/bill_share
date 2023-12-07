import { FC } from "react";
import { useLocation } from "react-router-dom";
import { ResetPasswordForm } from "../containers/ResetPasswordForm";
import { HeroLayout } from "../layouts/heroLayout";
import { useTranslation } from "react-i18next";

export const ResetPassword: FC = () => {
  const { search } = useLocation();
  const code = new URLSearchParams(search)?.get("code");
  const { t } = useTranslation();

  return (
    <HeroLayout>
      <div style={{ minWidth: "600px" }}>
        <p className="title mb-6">{t("TITLE_RESET_PASSWORD")}</p>
        {!code && <p className="subtitle">{t("SUBTITLE_RESET_PASSWORD")}</p>}
        {code && (
          <div className="box">
            <ResetPasswordForm code={code} />
          </div>
        )}
      </div>
    </HeroLayout>
  );
};

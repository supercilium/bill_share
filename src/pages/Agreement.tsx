import { FC } from "react";
import { HeroLayout } from "../layouts/heroLayout";
import { useTranslation } from "react-i18next";

export const ServiceAgreement: FC = () => {
  const { t } = useTranslation();
  return (
    <HeroLayout>
      <div>
        <p className="title mb-6">{t("TITLE_SERVICE_AGREEMENT")}</p>
        <p className="subtitle">{t("SERVICE_AGREEMENT")}</p>
      </div>
    </HeroLayout>
  );
};

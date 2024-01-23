import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";

export const EmptyPartyLayout: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();

  return (
    <p className="is-size-5 my-6 has-text-grey-light is-flex is-align-items-center">
      {t("EMPTY_LAYOUT")}
      <span className="ml-1 icon has-text-grey-light">
        <FontAwesomeIcon icon="beer-mug-empty" bounce={true} />
      </span>
      {children}
    </p>
  );
};

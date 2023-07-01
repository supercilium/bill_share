import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  ReactNode,
  useEffect,
} from "react";
import cx from "classnames";
import "./PartyFormLayout.scss";

interface PartyFormLayoutProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
  isDiscountVisible: boolean;
  isEquallyVisible: boolean;
  amountOfUsers: number;
}

const DISCOUNT_COL_WIDTH = "85px";
const SHARED_COL_WIDTH = "70px";

export const PartyFormLayout: FC<PartyFormLayoutProps> = ({
  children,
  className,
  isDiscountVisible,
  isEquallyVisible,
  amountOfUsers,
  ...props
}) => {
  useEffect(() => {
    window.requestAnimationFrame(() => {
      (document.querySelector(":root") as HTMLElement)?.style?.setProperty(
        "--discount-column",
        isDiscountVisible ? DISCOUNT_COL_WIDTH : "0"
      );
      (document.querySelector(":root") as HTMLElement)?.style?.setProperty(
        "--shared-column",
        isEquallyVisible ? SHARED_COL_WIDTH : "0"
      );
      (document.querySelector(":root") as HTMLElement)?.style?.setProperty(
        "--amount-of-users",
        `${amountOfUsers}` || "1"
      );
    });
  }, [amountOfUsers, isDiscountVisible, isEquallyVisible]);

  return (
    <div {...props} className={cx(className, "party-form-layout")}>
      {children}
    </div>
  );
};

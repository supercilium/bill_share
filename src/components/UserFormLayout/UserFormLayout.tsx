import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  ReactNode,
  useEffect,
} from "react";
import "./UserFormLayout.scss";

interface UserFormLayoutProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isDiscountVisible: boolean;
  isEquallyVisible: boolean;
  children: ReactNode;
}

const DISCOUNT_COL_WIDTH = "85px";
const SHARED_COL_WIDTH = "70px";

export const UserFormLayout: FC<UserFormLayoutProps> = ({
  children,
  className,
  isDiscountVisible,
  isEquallyVisible,

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
    });
  }, [isDiscountVisible, isEquallyVisible]);

  return (
    <div
      {...props}
      className={`${className ? className : ""} party-form-layout`}
    >
      {children}
    </div>
  );
};

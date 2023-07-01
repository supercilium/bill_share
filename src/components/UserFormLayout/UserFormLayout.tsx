import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from "react";
import cx from "classnames";
import "./UserFormLayout.scss";

interface UserFormLayoutProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

export const UserFormLayout: FC<UserFormLayoutProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={cx(className, "user-form-layout")}>
      {children}
    </div>
  );
};

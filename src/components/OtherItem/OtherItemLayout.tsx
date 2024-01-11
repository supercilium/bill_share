import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from "react";
import cx from "classnames";
import "./OtherItem.scss";

interface OtherItemLayoutProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

export const OtherItemLayout: FC<OtherItemLayoutProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={cx(className, "other-item")}>
      {children}
    </div>
  );
};

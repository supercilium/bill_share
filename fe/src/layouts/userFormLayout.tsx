import React, { FC, HTMLAttributes, ReactNode } from "react";

export const UserFormLayout: FC<
  {
    children: ReactNode;
    isDiscountVisible: boolean;
    isEquallyVisible: boolean;
  } & React.AllHTMLAttributes<HTMLAttributes<HTMLDivElement>>
> = ({ children, isDiscountVisible, isEquallyVisible }) => {
  return (
    <div
      className="my-3 is-align-items-center"
      style={{
        display: "grid",
        gridTemplateColumns: `200px 60px 70px ${
          isDiscountVisible ? "60px " : ""
        }${isEquallyVisible ? "3rem " : ""}70px`,
        gap: "16px",
      }}
    >
      {children}
    </div>
  );
};

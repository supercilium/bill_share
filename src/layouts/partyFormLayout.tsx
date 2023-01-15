import React, { FC, HTMLAttributes, ReactNode } from "react";

export const PartyFormLayout: FC<
  {
    children: ReactNode;
    amountOfUsers: number;
    isDiscountVisible: boolean;
    isEquallyVisible: boolean;
    isEqually: boolean;
  } & React.AllHTMLAttributes<HTMLAttributes<HTMLDivElement>>
> = ({
  children,
  amountOfUsers,
  isDiscountVisible,
  isEquallyVisible,
  isEqually,
}) => {
  return (
    <div
      className="my-3"
      style={{
        display: "grid",
        gridTemplateColumns: `200px 60px 70px ${
          isDiscountVisible ? "60px " : ""
        }${isEquallyVisible ? "3rem " : ""}repeat(${amountOfUsers}, ${
          isEqually ? "2rem" : "60px"
        })`,
        gap: "16px",
      }}
    >
      {children}
    </div>
  );
};

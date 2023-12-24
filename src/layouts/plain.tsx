import { FC, ReactNode } from "react";

interface PlainLayoutInterface {
  Header?: ReactNode;
  Aside?: ReactNode;
  Main: ReactNode;
}

export const PlainLayout: FC<PlainLayoutInterface> = ({
  Header,
  Aside,
  Main,
}) => {
  return (
    <div
      style={{ minHeight: "100vh" }}
      className="is-flex is-flex-direction-column is-justify-content-space-between"
    >
      {Header}
      <main className="is-flex-grow-5">{Main}</main>
      {Aside}
    </div>
  );
};

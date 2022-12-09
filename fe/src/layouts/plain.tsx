import { FC, ReactNode } from "react";

interface PlainLayoutInterface {
  Header: ReactNode;
  Aside?: ReactNode;
  Footer: ReactNode;
  Main: ReactNode;
}

export const PlainLayout: FC<PlainLayoutInterface> = ({
  Header,
  Aside,
  Footer,
  Main,
}) => {
  return (
    <div
      style={{ minHeight: "100vh" }}
      className="is-flex is-flex-direction-column is-justify-content-space-between"
    >
      <div>{Header}</div>
      <div className="is-flex-grow-5">{Main}</div>
      {Aside && <div>{Aside}</div>}
      <div>{Footer}</div>
    </div>
  );
};

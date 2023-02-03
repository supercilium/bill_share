import { FC, ReactNode } from "react";
import { Footer as FooterComponent, Navbar } from "../components";

interface PlainLayoutInterface {
  Header?: ReactNode;
  Aside?: ReactNode;
  Footer?: ReactNode;
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
      <Navbar />
      {Header}
      <main className="is-flex-grow-5">{Main}</main>
      {Aside}
      {Footer || (
        <FooterComponent>
          There is nothing better than a good party! ❤️
        </FooterComponent>
      )}
    </div>
  );
};

import { FC, ReactNode } from "react";
import { Footer } from "../components";
import { Navbar } from "../containers/Navbar";

interface PlainLayoutInterface {
  children: ReactNode;
}

export const HeroLayout: FC<PlainLayoutInterface> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <section className="hero is-fullheight">
        <div className="hero-body">{children}</div>
        <div className="hero-foot">
          <Footer>There is nothing better than a good party! ❤️</Footer>
        </div>
      </section>
    </div>
  );
};

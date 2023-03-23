import { FC, ReactNode } from "react";
import { Footer } from "../components";
import { Navbar } from "../containers/Navbar";
import { useScrollTop } from "../hooks/useScrollTop";

interface PlainLayoutInterface {
  children: ReactNode;
}

export const HeroLayout: FC<PlainLayoutInterface> = ({ children }) => {
  useScrollTop();

  return (
    <div>
      <Navbar navbarProps={{ hasShadow: true }} />
      <section className="hero is-fullheight">
        <div className="hero-body">{children}</div>
        <div className="hero-foot">
          <Footer>There is nothing better than a good party! ❤️</Footer>
        </div>
      </section>
    </div>
  );
};

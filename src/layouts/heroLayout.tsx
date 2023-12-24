import { FC, ReactNode } from "react";

interface PlainLayoutInterface {
  children: ReactNode;
}

export const HeroLayout: FC<PlainLayoutInterface> = ({ children }) => {
  return (
    <section className="hero is-fullheight">
      <div className="hero-body">{children}</div>
      <div className="hero-foot" id="hero-footer" />
    </section>
  );
};

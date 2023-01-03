import { FC, ReactNode } from "react";
import { Footer } from "../components";

interface PlainLayoutInterface {
  error: ReactNode;
  title: ReactNode;
}

export const ErrorLayout: FC<PlainLayoutInterface> = ({ error, title }) => {
  return (
    <div>
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div>
            <p className="title">{title}</p>
            <p className="subtitle is-flex is-align-items-baseline">{error}</p>
          </div>
        </div>
        <div className="hero-foot">
          <Footer>There is nothing better than a good party! ❤️</Footer>
        </div>
      </section>
    </div>
  );
};

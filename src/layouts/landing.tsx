import { FC, ReactNode } from "react";
import { Footer } from "../components";
import { Navbar } from "../containers/Navbar";

interface LandingLayoutProps {
  showcaseBody: ReactNode;
  showcaseFoot?: ReactNode;
  sections: ReactNode;
}

export const LandingLayout: FC<LandingLayoutProps> = ({
  showcaseBody,
  showcaseFoot,
  sections,
}) => {
  return (
    <>
      <div className="hero is-dark hero-with-background is-fullheight">
        <div className="hero-head">
          <Navbar navbarProps={{ isTransparent: true }} />
        </div>
        <div className="hero-body">{showcaseBody}</div>
        <div className="hero-foot">{showcaseFoot}</div>
      </div>
      {sections}
      <Footer>There is nothing better than a good party! ❤️</Footer>
    </>
  );
};

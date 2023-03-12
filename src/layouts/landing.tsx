import { FC, ReactNode } from "react";
import { Navbar } from "../containers/Navbar";

interface LandingLayoutProps {
  showcaseBody: ReactNode;
  showcaseFoot?: ReactNode;
  sections: ReactNode;
  footer: ReactNode;
}

export const LandingLayout: FC<LandingLayoutProps> = ({
  showcaseBody,
  showcaseFoot,
  sections,
  footer,
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
      {footer}
    </>
  );
};

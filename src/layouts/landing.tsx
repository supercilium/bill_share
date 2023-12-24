import { FC, ReactNode } from "react";
import { Navbar } from "../containers/Navbar";

interface LandingLayoutProps {
  sections: ReactNode;
  showcase: {
    body: ReactNode;
    foot?: ReactNode;
  };
}

export const LandingLayout: FC<LandingLayoutProps> = ({
  showcase,
  sections,
}) => {
  return (
    <>
      <div className="hero is-dark hero-with-background is-fullheight">
        <div className="hero-head">
          <Navbar navbarProps={{ isTransparent: true }} />
        </div>
        <div className="hero-body">{showcase.body}</div>
        <div className="hero-foot">{showcase.foot}</div>
      </div>
      {sections}
    </>
  );
};

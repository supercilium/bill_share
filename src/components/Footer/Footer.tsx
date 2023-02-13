import { FC, ReactNode } from "react";
import { Columns } from "../Columns";
import { VersionTag } from "./Footer.styles";

export const Footer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <footer className="footer is-relative">
      {children}
      <hr />
      <Columns>
        <div />
        <div>
          <p className="is-size-5 mb-2">Your party makers:</p>
          <p className="is-size-6 mb-1">
            <a href="https://github.com/Oyns">👷‍♂️ Motivator and data keeper</a>
          </p>
          <p className="is-size-6 mb-1">
            <a href="https://github.com/supercilium">
              👩‍💻 Visualizer and procrastinator
            </a>
          </p>
          <p className="is-size-6 mb-1">
            <a href="https://github.com/Ifkeybirf">
              🥷 benefactor (hosting), bad news deliver (QA), the lord of the
              dendro-fecal elements (Devops)
            </a>
          </p>
        </div>
      </Columns>
      <VersionTag className="has-text-right is-size-7 has-text-grey">
        <p className="container px-2">V. {process.env.REACT_APP_VERSION}</p>
      </VersionTag>
    </footer>
  );
};

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
            <a target="_blank" rel="noreferrer" href="https://github.com/Oyns">
              👷‍♂️ Motivator and data keeper
            </a>
          </p>
          <p className="is-size-6 mb-1">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/supercilium"
            >
              👩‍💻 Visualizer and procrastinator
            </a>
          </p>
          <p className="is-size-6 mb-1">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/Ifkeybirf"
            >
              🥷 benefactor (hosting), bad news deliver (QA), the lord of the
              dendro-fecal elements (Devops)
            </a>
          </p>
        </div>
      </Columns>
      <VersionTag className="px-5 has-text-grey">
        <a className="is-size-6 has-text-grey" href="/service-agreement">
          Service agreement
        </a>
        <span className="is-pulled-right is-size-7">
          V. {process.env.REACT_APP_VERSION}
        </span>
      </VersionTag>
    </footer>
  );
};

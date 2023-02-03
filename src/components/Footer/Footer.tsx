import { FC, ReactNode } from "react";
import { Columns } from "../Columns";

export const Footer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <footer className="footer">
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
            <a href="https://github.com/Ifkeybirf/ansigkastr">
              🥷 Hosting and processes
            </a>
          </p>
        </div>
      </Columns>
    </footer>
  );
};

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copy from "copy-to-clipboard";
import { FC, useEffect, useState } from "react";
import "./CopyButton.scss";

interface CopyButtonProps {
  title: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ title }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let clearCopiedTimeout: NodeJS.Timeout;
    if (isCopied) {
      clearCopiedTimeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(clearCopiedTimeout);
    };
  }, [isCopied]);

  return (
    <button
      title="Copy link to the party"
      className="button is-plain is-flex is-align-items-center"
      onClick={() => {
        const result = copy(window.location.href);
        setIsCopied(result);
      }}
    >
      <span className="is-size-3 mr-2 has-text-black">{title}</span>
      <span className={`copy-button-icon${isCopied ? " copied" : ""}`}>
        <FontAwesomeIcon
          size="lg"
          color={isCopied ? "hsl(141, 71%, 48%)" : "hsl(217, 71%, 53%)"}
          icon={isCopied ? "check" : "clone"}
        />
      </span>
    </button>
  );
};

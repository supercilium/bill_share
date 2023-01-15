import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Loader = () => {
  return (
    <span className="icon is-large has-text-grey">
      <FontAwesomeIcon size="2x" icon="spinner" spin={true} spinPulse={true} />
    </span>
  );
};

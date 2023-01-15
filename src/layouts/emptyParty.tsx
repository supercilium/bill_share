import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const EmptyPartyLayout = () => {
  return (
    <p className="is-size-5 my-6 has-text-grey-light is-flex is-align-items-center">
      Your table is empty... Start adding items{" "}
      <span className="ml-1 icon has-text-grey-light">
        <FontAwesomeIcon icon="beer-mug-empty" bounce={true} />
      </span>
    </p>
  );
};

import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./EditableImage.scss";

interface EditableImageProps {
  src: string;
  setIsEditing?: () => void;
}

export const EditableImage: FC<EditableImageProps> = ({
  src,
  setIsEditing,
}) => {
  return (
    <div className="root">
      <figure className="image is-128x128">
        <img
          className="is-rounded has-background-grey"
          src={src}
          alt="Avatar"
        />
      </figure>
      {setIsEditing && (
        <FontAwesomeIcon
          onClick={() => setIsEditing()}
          icon="pencil"
          className="img-button"
          title="Change avatar"
        />
      )}
    </div>
  );
};

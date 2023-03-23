import { FC, ReactNode } from "react";
import "./Card.scss";

interface CardProps {
  image?: {
    className?: string;
    imageUrl?: string;
    imageAlt?: string;
  };
  card?: {
    isFullHeight?: boolean;
  };
  content?: ReactNode;
}

export const Card: FC<CardProps> = ({ image, content, card }) => {
  return (
    <div className={`card${card?.isFullHeight ? " card-fullheight" : ""}`}>
      {image?.imageUrl && (
        <div className="card-image">
          <figure className={`image ${image.className || "is-4by3"}`}>
            <img src={image.imageUrl} alt={image.imageAlt || "It's an image"} />
          </figure>
        </div>
      )}
      {content && (
        <div className="card-content">
          <div className="content">{content}</div>
        </div>
      )}
    </div>
  );
};

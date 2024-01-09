import { FC, ReactNode } from "react";
import cx from "classnames";
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
    <div className={cx("card", { "card-fullheight": card?.isFullHeight })}>
      {image?.imageUrl && (
        <div className="card-image">
          <figure className={cx("image", image.className || "is-4by3")}>
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

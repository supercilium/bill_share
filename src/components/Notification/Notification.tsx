import { FC, ReactNode } from "react";
import { Container } from "./Notification.styles";

export interface NotificationProps {
  mode?: "primary" | "link" | "info" | "danger" | "warning" | "success";
  title?: ReactNode;
  text?: ReactNode;
  onClose: () => void;
}

export const Notification: FC<NotificationProps> = (props) => {
  const className = `notification box${props.mode ? ` is-${props.mode}` : ""}`;
  return (
    <Container className={className}>
      <button className="delete" onClick={() => props.onClose()}></button>
      {props.title && <p className="title is-5 my-2">{props.title}</p>}
      {props.text && <p>{props.text}</p>}
    </Container>
  );
};

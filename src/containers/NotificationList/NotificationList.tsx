import { FC } from "react";
import { Notification } from "../../components/Notification";
import { useNotifications } from "../../contexts/NotificationContext";
import { Container } from "./NotificationList.styles";

interface NotificationListProps {}

export const NotificationList: FC<NotificationListProps> = (props) => {
  const { alerts, removeAlert } = useNotifications();

  return (
    <Container>
      {alerts ? (
        <Notification {...alerts} onClose={() => removeAlert()} />
      ) : null}
    </Container>
  );
};

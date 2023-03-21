import { FC } from "react";
import { Notification } from "../../components/Notification";
import { useNotifications } from "../../contexts/NotificationContext";
import "./NotificationList.scss";

interface NotificationListProps {}

export const NotificationList: FC<NotificationListProps> = (props) => {
  const { alerts, removeAlert } = useNotifications();

  return (
    <div className="notifications-container">
      {alerts ? (
        <Notification {...alerts} onClose={() => removeAlert()} />
      ) : null}
    </div>
  );
};

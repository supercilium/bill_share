import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { NotificationProps } from "../components/Notification/Notification";

type Notification = Omit<NotificationProps, "onClose">;

interface NotificationContextInterface {
  alerts?: Notification;
  addAlert: React.Dispatch<React.SetStateAction<Notification | undefined>>;
  removeAlert: () => void;
}

const NotificationContext = React.createContext<NotificationContextInterface>({
  alerts: undefined,
  addAlert: () => {},
  removeAlert: () => {},
});

export const NotificationProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [alerts, setAlert] = useState<Notification>();
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (alerts) {
      timer.current = setTimeout(() => {
        setAlert(undefined);
      }, 5000);
    }

    return () => {
      clearTimeout(timer.current);
    };
  }, [alerts]);

  return (
    <NotificationContext.Provider
      value={{
        alerts,
        addAlert: setAlert,
        removeAlert: () => setAlert(undefined),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const user = useContext(NotificationContext);

  return user;
};

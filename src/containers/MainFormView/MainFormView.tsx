import { FC, ReactNode, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { User } from "../../types/user";

interface Props {
  UserView: FC<{ user?: User }>;
  PartyView: ReactNode;
}

export const MainFormView: FC<Props> = ({ UserView, PartyView }) => {
  const { watch, setValue, getValues } = useFormContext<FormSettings>();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as Node).nodeName !== "BODY") {
        return;
      }
      if (e.code === "KeyU") {
        setValue("view", "user");
        setValue("user", currentUser);
      }
      if (e.code === "KeyD") {
        setValue("isDiscountVisible", !getValues("isDiscountVisible"));
      }
      if (e.code === "KeyE") {
        setValue("isEquallyVisible", !getValues("isEquallyVisible"));
      }
      if (e.code === "KeyP") {
        setValue("view", "party");
      }
    };
    document.addEventListener("keyup", handler);

    return () => {
      document.removeEventListener("keyup", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const view = watch("view", "user");
  const user = watch("user", undefined);
  return <>{view === "user" ? <UserView user={user} /> : PartyView}</>;
};

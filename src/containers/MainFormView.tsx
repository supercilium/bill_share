import { FC, ReactNode, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormSettings } from "../contexts/PartySettingsContext";
import { User } from "../types/user";

interface Props {
  UserView: FC<{ user?: User }>;
  PartyView: ReactNode;
}

export const MainFormView: FC<Props> = ({ UserView, PartyView }) => {
  const { watch, setValue, getValues } = useFormContext<FormSettings>();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as Node).nodeName !== "BODY") {
        return;
      }
      if (e.key === "u" || e.key === "U") {
        setValue("view", "user");
      }
      if (e.key === "d" || e.key === "D") {
        setValue("isDiscountVisible", !getValues("isDiscountVisible"));
      }
      if (e.key === "e" || e.key === "E") {
        setValue("isEquallyVisible", !getValues("isEquallyVisible"));
      }
      if (e.key === "p" || e.key === "P") {
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

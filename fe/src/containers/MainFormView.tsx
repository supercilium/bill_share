import { FC, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { FormSettings } from "../contexts/PartySettingsContext";

export const MainFormView: FC<{
  UserView: ReactNode;
  PartyView: ReactNode;
}> = ({ UserView, PartyView }) => {
  const { watch } = useFormContext<FormSettings>();

  const view = watch("view", "user");
  return <>{view === "user" ? UserView : PartyView}</>;
};

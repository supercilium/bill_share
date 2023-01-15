import { FC, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { FormSettings } from "../contexts/PartySettingsContext";

interface Props {
  UserView: FC<{ user?: string }>;
  PartyView: ReactNode;
}

export const MainFormView: FC<Props> = ({ UserView, PartyView }) => {
  const { watch } = useFormContext<FormSettings>();

  const view = watch("view", "user");
  const user = watch("user", "");
  return <>{view === "user" ? <UserView user={user} /> : PartyView}</>;
};

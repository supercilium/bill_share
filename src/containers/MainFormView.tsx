import { FC, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { FormSettings } from "../contexts/PartySettingsContext";
import { User } from "../types/user";

interface Props {
  UserView: FC<{ user?: User }>;
  PartyView: ReactNode;
}

export const MainFormView: FC<Props> = ({ UserView, PartyView }) => {
  const { watch } = useFormContext<FormSettings>();

  const view = watch("view", "user");
  const user = watch("user", undefined);
  return <>{view === "user" ? <UserView user={user} /> : PartyView}</>;
};

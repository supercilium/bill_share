import React, { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { User } from "../types/user";

export interface FormSettings {
  isEquallyVisible: boolean;
  isDiscountVisible: boolean;
  view: "party" | "user";
  user?: User;
}

export const PartySettingsProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const handlers = useForm<FormSettings>({
    defaultValues: {
      isDiscountVisible: false,
      isEquallyVisible: false,
      view: "user",
      user: undefined,
    },
  });

  const view = handlers.watch("view");

  useEffect(() => {
    if (view === "party") {
      handlers.setValue("user", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return <FormProvider {...handlers}>{children}</FormProvider>;
};

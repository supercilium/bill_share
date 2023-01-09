import React, { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";

export interface FormSettings {
  isEquallyVisible: boolean;
  isDiscountVisible: boolean;
  view: "party" | "user";
}

export const PartySettingsProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handlers = useForm<FormSettings>({
    defaultValues: {
      isDiscountVisible: false,
      isEquallyVisible: false,
      view: "user",
    },
  });
  return <FormProvider {...handlers}>{children}</FormProvider>;
};

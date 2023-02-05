import React, { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { User } from "../types/user";

export interface FormSettings {
  isEquallyVisible: boolean;
  isDiscountVisible: boolean;
  view: "party" | "user";
  user?: User;
  discount?: number;
  discountPercent?: number;
  total: number;
}

export const PartySettingsProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};

  const handlers = useForm<FormSettings>({
    defaultValues: {
      isDiscountVisible: true,
      isEquallyVisible: true,
      view: "user",
      user: currentUser,
      total: 0,
      discountPercent: 0,
      discount: 0,
    },
  });

  const view = handlers.watch("view");
  const discount = handlers.watch("discount");
  const discountPercent = handlers.watch("discountPercent");
  const total = handlers.watch("total");

  useEffect(() => {
    if (view === "party") {
      handlers.setValue("user", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    if (!discountPercent || !total || !discount) {
      return;
    }
    handlers.setValue("discountPercent", (discount * 100) / total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return <FormProvider {...handlers}>{children}</FormProvider>;
};

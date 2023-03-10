import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { User } from "../types/user";
import { partySettingsSchema } from "../services/validation";

export interface FormSettings {
  isEquallyVisible: boolean;
  isDiscountVisible: boolean;
  view: "party" | "user";
  user?: User;
  discount?: number;
  isPercentage: boolean;
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
      isPercentage: true,
    },
    resolver: yupResolver(partySettingsSchema),
    mode: "all",
  });

  const view = handlers.watch("view");
  const discount = handlers.watch("discount");
  const isPercentage = handlers.watch("isPercentage");
  const total = handlers.watch("total");

  useEffect(() => {
    if (view === "party") {
      handlers.setValue("user", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    if (!total || !discount) {
      handlers.setValue("discountPercent", 0);
      return;
    }
    if (isPercentage) {
      return;
    }
    handlers.setValue("discountPercent", (discount * 100) / total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return <FormProvider {...handlers}>{children}</FormProvider>;
};

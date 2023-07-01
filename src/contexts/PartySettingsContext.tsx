import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router";
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
  isOnline: boolean;
}
const LS_USER_SETTINGS_KEY = "userSettings";

const DEFAULT_USER_SETTINGS: FormSettings = {
  isDiscountVisible: true,
  isEquallyVisible: true,
  view: "user",
  user: undefined,
  total: 0,
  discountPercent: 0,
  discount: 0,
  isPercentage: true,
  isOnline: false,
};

export const PartySettingsProvider: FC<{
  children: React.ReactNode;
  isOnline: boolean;
}> = ({ children, isOnline }) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};
  const userSettings =
    JSON.parse(localStorage.getItem(LS_USER_SETTINGS_KEY) || "{}") || {};

  const { partyId } = useParams();

  const defaultValues =
    Object.values(userSettings).length > 0 && userSettings.partyId === partyId
      ? { ...DEFAULT_USER_SETTINGS, ...userSettings, isOnline }
      : {
          ...DEFAULT_USER_SETTINGS,
          user: currentUser,
          isOnline,
        };

  const handlers = useForm<FormSettings>({
    defaultValues,
    resolver: yupResolver(partySettingsSchema),
    mode: "all",
  });

  const view = handlers.watch("view");
  const discount = handlers.watch("discount");
  const isPercentage = handlers.watch("isPercentage");
  const total = handlers.watch("total");

  useEffect(() => {
    return () => {
      const partySettings = handlers.getValues();
      localStorage.setItem(
        LS_USER_SETTINGS_KEY,
        JSON.stringify({
          isDiscountVisible: partySettings.isDiscountVisible,
          isEquallyVisible: partySettings.isEquallyVisible,
          view: partySettings.view,
          user: partySettings.user,
          partyId,
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

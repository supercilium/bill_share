import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { FormSettings } from "../contexts/PartySettingsContext";
import { PartyInterface } from "../types/party";
import { getBaseTotal } from "../utils/calculation";
import { itemsSchema } from "../services/validation";

interface Params {
  party: PartyInterface;
}

export const useParty = ({ party }: Params) => {
  const handlers = useForm<PartyInterface>({
    resolver: yupResolver(itemsSchema),
    defaultValues: party,
    mode: "all",
  });
  const { setValue } = useFormContext<FormSettings>();

  useEffect(() => {
    handlers.reset(party);
    const total = getBaseTotal(party.items);
    setValue("total", total);
    setValue(
      "discountPercent",
      party.isPercentage
        ? party.discount
        : Number((((party.discount || 0) * 100) / +total).toFixed(2))
    );
    setValue("discount", party.discount);
    setValue("isPercentage", party.isPercentage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party, handlers]);

  return handlers;
};

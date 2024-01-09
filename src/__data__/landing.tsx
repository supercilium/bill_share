import { Translation } from "react-i18next";
import { Card } from "../components/Card";
import { PartyInterface } from "../types/party";
import { COCKTAIL_PARTY } from "./cocktail-party";
import { FISH_PARTY } from "./fish-party";
import { HARD_PARTY } from "./hard-party";
import { MEAT_PARTY } from "./meat-party";
import { SALAD_PARTY } from "./salad-party";

export type PartiesShowcase =
  | "shared"
  | "parts"
  | "discount"
  | "discount-percentage"
  | "discount-items";

export const DATA_MOCKS: Record<PartiesShowcase, PartyInterface> = {
  shared: FISH_PARTY,
  parts: SALAD_PARTY,
  discount: MEAT_PARTY,
  "discount-percentage": COCKTAIL_PARTY,
  "discount-items": HARD_PARTY,
};

export const TAB_LABELS: Record<PartiesShowcase, string> = {
  shared: "LANDING_TAB_LABEL_SHARED",
  parts: "LANDING_TAB_LABEL_PARTS",
  discount: "LANDING_TAB_LABEL_DISCOUNT",
  "discount-percentage": "LANDING_TAB_LABEL_DISCOUNT_PERCENTAGE",
  "discount-items": "LANDING_TAB_LABEL_DISCOUNT_ITEMS",
};

export const CARDS: Array<React.ComponentPropsWithoutRef<typeof Card>> = [
  {
    card: {
      isFullHeight: true,
    },
    image: { imageUrl: "/static/media/get-some-drinks.jpg" },
    content: <Translation>{(t) => <p>{t("LANDING_CARD_1")}</p>}</Translation>,
  },
  {
    card: {
      isFullHeight: true,
    },
    image: { imageUrl: "/static/media/pay-bill.jpg" },
    content: <Translation>{(t) => <p>{t("LANDING_CARD_2")}</p>}</Translation>,
  },
  {
    card: {
      isFullHeight: true,
    },
    image: { imageUrl: "/static/media/friends-convince.jpg" },
    content: <Translation>{(t) => <p>{t("LANDING_CARD_3")}</p>}</Translation>,
  },
];

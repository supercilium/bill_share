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
  shared: "Shared everything",
  parts: "In parts",
  discount: "With discount",
  "discount-percentage": "With discount in %",
  "discount-items": "With discount for some items",
};

export const CARDS: Array<React.ComponentPropsWithoutRef<typeof Card>> = [
  {
    card: {
      isFullHeight: true,
    },
    image: { imageUrl: "/get-some-drinks.jpg" },
    content: (
      <p>Share party with friends and start adding your drinks and snaks</p>
    ),
  },
  {
    card: {
      isFullHeight: true,
    },
    image: { imageUrl: "/pay-bill.jpg" },
    content: <p>Check, please! You already know how much you should pay</p>,
  },
  {
    card: {
      isFullHeight: true,
    },
    image: { imageUrl: "/friends-convince.jpg" },
    content: <p>Convince your friends to return your money</p>,
  },
];

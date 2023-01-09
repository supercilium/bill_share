import { useFormContext } from "react-hook-form";
import { Block, Field } from "../components";

export const PartySettings = () => {
  const handlers = useFormContext();

  return (
    <Block title="Party settings">
      <Field
        label=" Show discount"
        inputProps={{
          type: "checkbox",
          ...handlers.register("isDiscountVisible"),
        }}
      />
      <Field
        label=" Show equality"
        inputProps={{
          type: "checkbox",
          ...handlers.register("isEquallyVisible"),
        }}
      />
      <Field
        labels={[" User ", " Full party "]}
        inputProps={{
          type: "radio",
          value: ["user", "party"],
          ...handlers.register("view"),
        }}
      />
    </Block>
  );
};

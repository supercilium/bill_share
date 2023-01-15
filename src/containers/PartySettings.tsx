import { useFormContext } from "react-hook-form";
import { Block, Columns, Field } from "../components";

export const PartySettings = () => {
  const handlers = useFormContext();

  return (
    <Block title="Party settings">
      <div className="columns is-desktop">
        <div className="column is-three-fifths">
          <Columns>
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
          </Columns>
        </div>
      </div>
    </Block>
  );
};

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router";
import { Block, Columns, Field } from "../components";
import { useDebounce } from "../hooks/useDebounce";
import { sendEvent } from "../utils/eventHandlers";
import { socketClient } from "../__api__/socket";

export const PartySettings = () => {
  const handlers = useFormContext();
  const { partyId } = useParams();

  const discountPercentHandlers = handlers.register("discountPercent");
  const discountHandlers = handlers.register("discount");
  const total = handlers.watch("total");
  const discountPercent = handlers.watch("discountPercent", 0);
  const debouncedDiscount = useDebounce<number>(discountPercent, 500);

  const handleUpdateDiscount = async (discount: number) => {
    sendEvent({
      type: "update discount",
      partyId: partyId as string,
      discount,
    });
  };

  useEffect(() => {
    if ((debouncedDiscount + "").length > 0 && socketClient.connected) {
      handleUpdateDiscount(+debouncedDiscount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDiscount]);

  return (
    <Block title="Party settings">
      <div className="columns is-desktop">
        <div className="column is-four-fifths">
          <Columns>
            <Block>
              <p className="has-text-grey-dark is-size-5 mb-3">
                Visibility settings
              </p>
              <p className="has-text-grey is-size-6 mb-3">
                We hid unimportant columns, because form already has a lot of
                staff and we do not have a designer to make it fits the screen
                (at least for now). So you can choose to show discount and
                equality columns here.
              </p>

              <Field
                label=" Show discount column for items"
                inputProps={{
                  type: "checkbox",
                  ...handlers.register("isDiscountVisible"),
                }}
              />
              <Field
                label=" Show equality column"
                inputProps={{
                  type: "checkbox",
                  ...handlers.register("isEquallyVisible"),
                }}
              />
              <p className="has-text-grey is-size-6 mb-3">
                Equally means items will shared between all participants (guys
                with checked checkboxes), in the other way you will have an
                opportunity to write amounts of items to each member.
              </p>
            </Block>
            <Block>
              <p className="has-text-grey-dark is-size-5 mb-3">Switch view</p>
              <p className="has-text-grey is-size-6 mb-3">
                You can switch view to see full party with all participants and
                tons of checkboxes or only your items. Clicking on member's name
                or totals will switch the form to that member's view.
              </p>

              <Field
                labels={[" User ", " Full party "]}
                inputProps={{
                  type: "radio",
                  value: ["user", "party"],
                  ...handlers.register("view"),
                }}
              />
            </Block>
          </Columns>

          <Block>
            <p className="has-text-grey-dark is-size-5 mb-3">
              Discounts and tips
            </p>
            <p className="has-text-grey is-size-6 mb-3">
              You can add discount for any item by switching on discount column
              or by putting discount for full bill here. In percentage or
              absolute amount - these fields are calculated depending on total
              sum of your bill. All discounts (item's and for full bill) will be
              summarized.
            </p>
            <Field
              label="Full party discount (absolute value)"
              inputProps={{
                type: "number",
                min: 0,
                max: total,
                style: { maxWidth: "10rem" },
                ...discountHandlers,
                onChange: (e) => {
                  if (total) {
                    handlers.setValue(
                      "discountPercent",
                      (+e.target.value * 100) / +total
                    );
                  }

                  return discountHandlers.onChange(e);
                },
              }}
            />
            <Field
              label="Full party discount (percent)"
              inputProps={{
                type: "number",
                min: 0,
                max: 100,
                step: 5,
                style: { maxWidth: "10rem" },
                ...discountPercentHandlers,
                onChange: (e) => {
                  if (total) {
                    handlers.setValue(
                      "discount",
                      +e.target.value * +total * 0.01
                    );
                  }

                  return discountPercentHandlers.onChange(e);
                },
              }}
            />
          </Block>
        </div>
      </div>
    </Block>
  );
};

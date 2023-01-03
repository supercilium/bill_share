import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Block, Field } from "../components";
import { Item } from "../types/item";
import { PartyInterface } from "../types/party";
import { socketClient } from "../__api__/socket";

export const PartyForm: FC<{
  party: PartyInterface;
  currentUser: { id: string; name: string };
}> = ({ party, currentUser }) => {
  const { users } = party;
  const { partyId } = useParams();
  const { register, reset } = useForm<PartyInterface>({
    defaultValues: party,
    mode: "onBlur",
  });

  const handleChangeItem = async (data: Partial<Omit<Item, "users">>) => {
    socketClient.socket.send(
      JSON.stringify({
        type: "update item",
        userId: currentUser.id,
        partyId,
        ...data,
      })
    );
  };
  const handleChangeUserInItem = async (
    shouldAddUser: boolean,
    userId: string,
    itemId: string
  ) => {
    socketClient.socket.send(
      JSON.stringify({
        type: shouldAddUser ? "add user to item" : "remove user from item",
        userId,
        partyId,
        itemId,
        value: 1,
      })
    );
  };
  const handleRemoveItem = (id: string) => {
    socketClient.socket.send(
      JSON.stringify({
        type: "remove item",
        userId: currentUser.id,
        partyId,
        itemId: id,
      })
    );
  };

  useEffect(() => {
    reset(party);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party]);

  if (!party.items.length) {
    return (
      <p className="is-size-5 my-6 has-text-grey-light">
        Your table is empty...
      </p>
    );
  }

  return (
    <Block title="Party form">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `200px 60px 70px 60px 3rem repeat(${users.length}, 2rem)`,
          gap: "16px",
        }}
      >
        <span className="is-size-6">Item name</span>
        <span className="is-size-6">Amount</span>
        <span className="is-size-6">Price</span>
        <span className="is-size-6">Discount</span>
        <span className="is-size-6">Equally</span>
        {users?.length > 0 ? (
          users.map(({ id, name }) => (
            <span
              key={id}
              className={`is-size-6${
                id === currentUser.id ? " has-text-info" : ""
              }`}
              style={{ transform: "rotate(-42deg)" }}
              title={name}
            >
              {name}
            </span>
          ))
        ) : (
          <div />
        )}
      </div>

      <form>
        {party.items.map((itemProps, i) => {
          const { users: itemUsers, ...item } = itemProps;
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `200px 60px 70px 60px 3rem repeat(${users.length}, 2rem)`,
                gap: "16px",
              }}
              className="my-3"
              key={item.id}
            >
              <span className="is-size-4 is-flex is-align-items-center ">
                <button
                  type="button"
                  className="delete mr-2"
                  title="Remove item"
                  onClick={() => handleRemoveItem(item.id)}
                />

                <Field
                  inputProps={{
                    type: "text",
                    ...register(`items.${i}.name`),
                    onBlur: ({ target }) => {
                      if (target.value === item.name) {
                        return new Promise(() => {});
                      }
                      return handleChangeItem({
                        id: item.id,
                        name: target.value,
                      });
                    },
                  }}
                />
              </span>
              <span className="is-size-4">
                <Field
                  inputProps={{
                    type: "number",
                    ...register(`items.${i}.amount`),
                    onBlur: ({ target }) => {
                      if (+target.value === item.amount) {
                        return new Promise(() => {});
                      }

                      return handleChangeItem({
                        id: item.id,
                        amount: +target.value,
                      });
                    },
                  }}
                />
              </span>
              <span className="is-size-4">
                <Field
                  inputProps={{
                    type: "number",
                    ...register(`items.${i}.price`),
                    onBlur: ({ target }) => {
                      if (+target.value === item.price) {
                        return new Promise(() => {});
                      }

                      return handleChangeItem({
                        id: item.id,
                        price: +target.value,
                      });
                    },
                  }}
                />
              </span>
              <span className="is-size-4">
                <Field
                  inputProps={{
                    type: "number",
                    ...register(`items.${i}.discount`),
                    onBlur: ({ target }) => {
                      if (+target.value === item.discount) {
                        return new Promise(() => {});
                      }

                      return handleChangeItem({
                        id: item.id,
                        discount: +target.value,
                      });
                    },
                  }}
                />
              </span>
              <input
                type="checkbox"
                className="is-size-4 checkbox mr-4"
                {...register(`items.${i}.equally`)}
                onChange={({ target }) =>
                  handleChangeItem({
                    id: item.id,
                    equally: target.checked,
                  })
                }
              />
              {users.map(({ id }) => (
                <input
                  key={id}
                  type="checkbox"
                  className="is-size-4 checkbox"
                  checked={!!itemUsers?.find((user) => user.id === id)}
                  onChange={({ target }) =>
                    handleChangeUserInItem(target.checked, id, item.id)
                  }
                />
              ))}
            </div>
          );
        })}
      </form>
    </Block>
  );
};

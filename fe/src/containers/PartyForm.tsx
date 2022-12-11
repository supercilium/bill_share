import { FC } from "react";
import { useForm } from "react-hook-form";
import { Block } from "../components";
import { PartyInterface } from "../types/party";

export const PartyForm: FC<{ party: PartyInterface }> = ({ party }) => {
  const { register, handleSubmit, watch } = useForm<PartyInterface>();
  const users = [party.owner, ...party.users];

  return (
    <Block title="Party form">
      <form>
        {party.items.map((item) => (
          <div key={item.id}>
            <span>{item.name}</span>
            <span>{item.amount}</span>
            <span>{item.price}</span>
            {users.map(({ id }) => (
              <input
                key={id}
                type="checkbox"
                checked={!!item.users?.find((user) => user.id === id)}
              />
            ))}
          </div>
        ))}
      </form>
    </Block>
  );
};

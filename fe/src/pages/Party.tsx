import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Block, Columns, Field, Footer, Header, Main } from "../components";
import { PartyForm } from "../containers/PartyForm";
import { PlainLayout } from "../layouts/plain";
import { PartyInterface } from "../types/party";
import { createUser, getPartyById } from "../__api__/party";
import { socket } from "../__api__/socket";

interface ItemCreationInterface {
  itemName: string;
  itemPrice: number;
  amount: number;
}

export const Party = () => {
  const { partyId } = useParams();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}") || {}
  );
  const addItemFormHandlers = useForm<ItemCreationInterface>({
    defaultValues: {
      itemName: "",
      itemPrice: 0,
      amount: 1,
    },
  });
  const { isValid: isAddItemFormValid, isDirty: isAddItemFormDirty } =
    addItemFormHandlers.formState;
  const addUserFormHandlers = useForm<{ userName: string }>({
    defaultValues: {
      userName: "",
    },
  });
  const { isValid: isAddUserFormValid, isDirty: isAddUserFormDirty } =
    addUserFormHandlers.formState;

  const [party, setParty] = useState<PartyInterface | null>(null);
  const [userName, setUserName] = useState<string | undefined>();
  const fetchParty = async (id: string) => {
    try {
      const parties = await getPartyById(id);
      if ("error" in parties) {
        setParty(null);
      } else {
        setParty(parties as PartyInterface);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const eventHandler = (event: MessageEvent<string>) => {
    setParty(JSON.parse(event.data));
    console.log(event);
  };

  useEffect(() => {
    socket.addEventListener("message", eventHandler);
    socket.addEventListener("connect", () => {
      console.log("is connected");
    });
    socket.addEventListener("disconnect", () => {
      console.log("is disconnected");
    });

    return () => {
      socket.removeEventListener("message", eventHandler);
      socket.removeEventListener("connect", () => {});
      socket.removeEventListener("disconnect", () => {});
    };
  }, []);

  useEffect(() => {
    if (partyId) {
      fetchParty(partyId);
    }
  }, [partyId, currentUser]);

  const handleAddUser = ({ userName }: { userName: string }) => {
    socket.send(JSON.stringify({ type: "add user", userName, partyId }));
    addUserFormHandlers.reset();
  };
  const handleRemoveUser = (userId: string) => {
    socket.send(JSON.stringify({ type: "remove user", userId, partyId }));
  };
  const handleAddItem = (data: ItemCreationInterface) => {
    socket.send(
      JSON.stringify({
        type: "add item",
        userId: currentUser.id,
        partyId,
        itemName: data.itemName,
        itemPrice: data.itemPrice,
        amount: data.amount,
      })
    );
    addItemFormHandlers.reset();
  };
  const handleCreateUser = async () => {
    const response = await createUser({ userName, partyId });
    localStorage.setItem("user", JSON.stringify(response));

    setCurrentUser(response);
  };

  const renderMain = () => {
    if (!party) {
      return null;
    }
    if (
      !currentUser.id ||
      ![...party.users, party.owner].find((user) => user.id === currentUser.id)
    ) {
      return (
        <div className="container">
          <h2 className="title is-2 my-5">Enter your name</h2>
          <div className="field">
            <label htmlFor="username" className="label">
              Enter your name
            </label>
            <input
              className="input"
              type="text"
              name="username"
              value={userName}
              onChange={({ target }) => setUserName(target.value)}
            />
          </div>
          <button
            type="submit"
            className="button"
            onClick={() => handleCreateUser()}
          >
            Join party
          </button>
        </div>
      );
    }
    return (
      <>
        <Block>
          <p className="subtitle is-4 my-1">
            Link to this party:{" "}
            <span className="tag is-medium">{window.location.href}</span>
          </p>
          <p className="subtitle is-4 my-1">Party maker: {party.owner.name}</p>
        </Block>

        <Columns>
          <div>
            <Block title="You can add new participant">
              <form
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 100px",
                  gap: "16px",
                  alignItems: "flex-end",
                }}
                onSubmit={addUserFormHandlers.handleSubmit(handleAddUser)}
              >
                <Field
                  label="User name"
                  inputProps={{
                    type: "text",
                    placeholder: "Enter user name",
                    ...addUserFormHandlers.register("userName", {
                      required: true,
                    }),
                  }}
                />
                <button
                  className="button mb-3"
                  type="submit"
                  disabled={!isAddUserFormValid || !isAddUserFormDirty}
                >
                  Add user
                </button>
              </form>
            </Block>
          </div>
          <div>
            {party.users.length > 0 ? (
              <Block title="And remove one of these guys">
                {party.users.map((user) => (
                  <p
                    key={user.id}
                    className="is-size-4 is-flex is-align-items-center"
                  >
                    {user.name}{" "}
                    <button
                      type="button"
                      className="delete ml-2"
                      onClick={() => handleRemoveUser(user.id)}
                    ></button>
                  </p>
                ))}
              </Block>
            ) : null}
          </div>
        </Columns>
        <PartyForm party={party} currentUser={currentUser} />
        <Block title="Add new item to share">
          <form
            style={{
              display: "grid",
              gridTemplateColumns: "200px 60px 70px 100px",
              gap: "16px",
              alignItems: "flex-end",
            }}
            onSubmit={addItemFormHandlers.handleSubmit(handleAddItem)}
          >
            <Field
              label="Item name"
              inputProps={{
                type: "text",
                placeholder: "Enter item name",
                ...addItemFormHandlers.register("itemName", { required: true }),
              }}
            />
            <Field
              label="Amount"
              inputProps={{
                type: "number",
                ...addItemFormHandlers.register("amount", {
                  required: true,
                  min: 1,
                }),
              }}
            />
            <Field
              label="Price"
              inputProps={{
                type: "number",
                ...addItemFormHandlers.register("itemPrice", {
                  required: true,
                  min: 0,
                }),
              }}
            />
            <button
              type="submit"
              className="button mb-3"
              disabled={!isAddItemFormValid || !isAddItemFormDirty}
            >
              Add item
            </button>
          </form>
        </Block>
      </>
    );
  };

  return (
    <PlainLayout
      Header={
        <Header>
          {!party ? (
            <h2 className="title is-2 my-5">No party</h2>
          ) : (
            <h2 className="title is-2 my-5">
              Hello, {currentUser.name}! Welcome to {party?.name}
            </h2>
          )}
        </Header>
      }
      Footer={<Footer>There is nothing better than a good party! ❤️</Footer>}
      Main={<Main>{renderMain()}</Main>}
    />
  );
};

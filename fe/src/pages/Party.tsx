import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router";
import { Block, Columns, Field, Footer, Header, Main } from "../components";
import { PartyForm } from "../containers/PartyForm";
import { PartyTotals } from "../containers/PartyTotals";
import { ErrorLayout } from "../layouts/error";
import { PlainLayout } from "../layouts/plain";
import { PartyInterface } from "../types/party";
import { getPartyById } from "../__api__/party";
import { socketClient } from "../__api__/socket";
import { JoinPartyForm } from "../containers/JoinPartyForm";
import { User } from "../types/user";

interface ItemCreationInterface {
  item: string;
  price: number;
  amount: number;
}

export const Party = () => {
  const { partyId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socket = socketClient.socket;
  const [currentUser, setCurrentUser] = useState<User>(
    JSON.parse(localStorage.getItem("user") || "{}") || {}
  );
  const addItemFormHandlers = useForm<ItemCreationInterface>({
    defaultValues: {
      item: "",
      price: 0,
      amount: 1,
    },
  });
  const { isValid: isAddItemFormValid, isDirty: isAddItemFormDirty } =
    addItemFormHandlers.formState;
  const addUserFormHandlers = useForm<{ user: string }>({
    defaultValues: {
      user: "",
    },
  });
  const { isValid: isAddUserFormValid, isDirty: isAddUserFormDirty } =
    addUserFormHandlers.formState;

  const [party, setParty] = useState<PartyInterface | null>(null);
  const fetchParty = async (id: string) => {
    try {
      setIsLoading(true);
      const parties = await getPartyById(id);
      if ("error" in parties) {
        setParty(null);
      } else {
        setParty(parties as PartyInterface);
        console.log(parties.id);
        if (!socketClient.connected) {
          socketClient.connect(id, eventHandler);
        }
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const eventHandler = useCallback((event: MessageEvent<string>) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "error") {
        console.error(data.message);
        return;
      }
      setParty(data);
      console.log(event);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (partyId) {
      fetchParty(partyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!party) {
    return (
      <ErrorLayout
        title="Looks like there is no such party"
        error={
          <>
            Try to update page or go to{" "}
            <a className="button ml-2" href="/">
              home page
            </a>
          </>
        }
      />
    );
  }

  if (
    !socket ||
    socket.readyState === 3 ||
    socket.readyState === 2 ||
    socketClient.error
  ) {
    return (
      <ErrorLayout
        title="Ooops! Something went wrong"
        error="No socket connection"
      />
    );
  }

  const handleAddUser = ({ user }: { user: string }) => {
    socket.send(JSON.stringify({ type: "add user", user, partyId }));
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
        item: data.item,
        price: data.price,
        amount: data.amount,
      })
    );
    addItemFormHandlers.reset();
  };

  const renderMain = () => {
    if (
      !currentUser.id ||
      ![...party.users, party.owner].find((user) => user.id === currentUser.id)
    ) {
      return <JoinPartyForm setCurrentUser={setCurrentUser} />;
    }
    return (
      <>
        <Block>
          <p className="subtitle is-4 my-1">
            Link to this party:{" "}
            <span
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
              title="Click to copy"
              className="tag is-medium"
              style={{ cursor: "pointer" }}
            >
              <span className="mr-1 icon has-text-grey">
                <FontAwesomeIcon icon="copy" />
              </span>
              {window.location.href}
            </span>
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
                    ...addUserFormHandlers.register("user", {
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
              <Block title="And remove any of these guys">
                {party.users.map((user) => (
                  <p
                    key={user.id}
                    className="is-size-4 is-flex is-align-items-center"
                  >
                    {user.name}{" "}
                    {user.id !== party.owner.id ? (
                      <button
                        type="button"
                        className="delete ml-2"
                        onClick={() => handleRemoveUser(user.id)}
                      ></button>
                    ) : (
                      <span
                        className="ml-2 icon has-text-grey-light"
                        title="Master of the party"
                      >
                        <FontAwesomeIcon icon="crown" />
                      </span>
                    )}
                  </p>
                ))}
              </Block>
            ) : null}
          </div>
        </Columns>
        <PartyForm party={party} currentUser={currentUser} />
        <PartyTotals party={party} currentUser={currentUser} />
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
                ...addItemFormHandlers.register("item", { required: true }),
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
                ...addItemFormHandlers.register("price", {
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
          <h2 className="title is-2 my-5">
            Hello, {currentUser.name}! Welcome to {party?.name}
          </h2>
        </Header>
      }
      Footer={<Footer>There is nothing better than a good party! ❤️</Footer>}
      Main={<Main>{renderMain()}</Main>}
    />
  );
};

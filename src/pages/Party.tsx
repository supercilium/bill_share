import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router";
import { Aside, Header, Main } from "../components";
import { PartyForm } from "../containers/PartyForm";
import { PartyTotals } from "../containers/PartyTotals";
import { ErrorLayout } from "../layouts/error";
import { PlainLayout } from "../layouts/plain";
import { PartyInterface } from "../types/party";
import { getPartyById } from "../__api__/party";
import { socketClient } from "../__api__/socket";
import { JoinPartyForm } from "../containers/JoinPartyForm";
import { User } from "../types/user";
import { AddItemForm } from "../containers/AddItemForm";
import { Loader } from "../components/Loader";
import { PartySettings } from "../containers/PartySettings";
import { PartySettingsProvider } from "../contexts/PartySettingsContext";
import { UserPartyForm } from "../containers/UserPartyForm";
import { MainFormView } from "../containers/MainFormView";

export const Party = () => {
  const { partyId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socket = socketClient.socket;
  const [currentUser, setCurrentUser] = useState<User>(
    JSON.parse(localStorage.getItem("user") || "{}") || {}
  );
  const [party, setParty] = useState<PartyInterface | null>(null);

  const fetchParty = async (id: string) => {
    try {
      setIsLoading(true);
      const parties = await getPartyById(id);
      if ("error" in parties) {
        setParty(null);
      } else {
        setParty(parties as PartyInterface);
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
    return (
      <div
        style={{ minHeight: "100vh" }}
        className="is-flex is-align-items-center is-flex-direction-column is-justify-content-center"
      >
        <Loader />
      </div>
    );
  }

  if (!party || !partyId) {
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

  const renderMain = () => {
    if (
      !currentUser.id ||
      ![...party.users, party.owner].find((user) => user.id === currentUser.id)
    ) {
      return <JoinPartyForm setCurrentUser={setCurrentUser} />;
    }
    return (
      <>
        <MainFormView
          UserView={({ user }) => (
            <UserPartyForm party={party} user={user || currentUser} />
          )}
          PartyView={
            <div className="box">
              <PartyForm party={party} currentUser={currentUser} />
              <PartyTotals party={party} currentUser={currentUser} />
            </div>
          }
        />
        <AddItemForm />
      </>
    );
  };

  return (
    <PartySettingsProvider>
      <PlainLayout
        Header={
          <Header>
            <h2 className="title is-2 my-5 icon-text">
              <a href="/" title="Home page" className="mr-4">
                <FontAwesomeIcon
                  color="rgb(156,26,26)"
                  icon="champagne-glasses"
                />
              </a>
              <span>
                {currentUser.name ? `Hello, ${currentUser.name}` : "Hello"}!
                Welcome to {party?.name}
              </span>
              <span>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  title="Copy link to the party"
                  className="ml-3 is-size-4"
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <FontAwesomeIcon icon="link" />
                </a>
              </span>
            </h2>
          </Header>
        }
        Main={<Main>{renderMain()}</Main>}
        Aside={
          <Aside>
            <PartySettings party={party} />
          </Aside>
        }
      />
    </PartySettingsProvider>
  );
};

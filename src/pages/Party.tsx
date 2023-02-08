import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router";
import { Aside, Header, Main } from "../components";
import { HeroLayout } from "../layouts/heroLayout";
import { PlainLayout } from "../layouts/plain";
import { PartyInterface } from "../types/party";
import { getPartyById } from "../__api__/party";
import { socketClient } from "../__api__/socket";
import { JoinPartyForm } from "../containers/JoinPartyForm";
import { User } from "../types/user";
import { AddItemForm } from "../containers/AddItemForm/AddItemForm";
import { Loader } from "../components/Loader";
import { PartySettings } from "../containers/PartySettings";
import { PartySettingsProvider } from "../contexts/PartySettingsContext";
import { UserPartyForm } from "../containers/UserPartyForm";
import { MainFormView } from "../containers/MainFormView";
import { PartyView } from "../containers/PartyView";
import copy from "copy-to-clipboard";
import { Navbar } from "../containers/Navbar";

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
      <HeroLayout>
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      </HeroLayout>
    );
  }

  if (!party || !partyId) {
    return (
      <HeroLayout>
        <div>
          <p className="title">Looks like there is no such party</p>
          <p className="subtitle is-flex is-align-items-baseline">
            Try to refresh the page or go to{" "}
            <a className="button ml-2" href="/">
              home page
            </a>
          </p>
        </div>
      </HeroLayout>
    );
  }

  if (
    !socket ||
    socket.readyState === 3 ||
    socket.readyState === 2 ||
    socketClient.error
  ) {
    return (
      <HeroLayout>
        <div>
          <p className="title">Ooops! Something went wrong</p>
          <p className="subtitle is-flex is-align-items-baseline">
            No connection{" "}
            <button
              onClick={() => socketClient.reConnect(partyId, eventHandler)}
              className="button ml-2"
            >
              re-connect
            </button>
          </p>
        </div>
      </HeroLayout>
    );
  }

  const isNoUser =
    !currentUser.id ||
    ![...party.users, party.owner].find((user) => user.id === currentUser.id);

  const renderMain = () => {
    if (isNoUser) {
      return <JoinPartyForm setCurrentUser={setCurrentUser} />;
    }
    return (
      <>
        <MainFormView
          UserView={({ user }) => (
            <UserPartyForm party={party} user={user || currentUser} />
          )}
          PartyView={<PartyView party={party} user={currentUser} />}
        />
        <AddItemForm />
      </>
    );
  };

  return (
    <PartySettingsProvider>
      <PlainLayout
        Navbar={<Navbar shouldShowAuthButtons={true} />}
        Header={
          <Header>
            <h2 className="title is-3">
              <span>
                {currentUser.name ? `Hello, ${currentUser.name}` : "Hello"}!
                Welcome to {party?.name}
              </span>
              <span>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  title="Copy link to the party"
                  className="ml-3 is-size-4"
                  onClick={() => {
                    copy(window.location.href);
                  }}
                >
                  <FontAwesomeIcon icon="link" />
                </a>
              </span>
            </h2>
          </Header>
        }
        Main={<Main>{renderMain()}</Main>}
        Aside={
          !isNoUser && (
            <Aside>
              <PartySettings party={party} />
            </Aside>
          )
        }
      />
    </PartySettingsProvider>
  );
};

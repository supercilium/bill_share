import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate, useParams } from "react-router";
import { Aside, Header, Main } from "../components";
import { HeroLayout } from "../layouts/heroLayout";
import { PlainLayout } from "../layouts/plain";
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
import { useQuery, useQueryClient } from "react-query";
import { useUser } from "../contexts/UserContext";
import { PartyInterface } from "../types/party";
import { useLogout } from "../hooks/useLogout";

export const Party = () => {
  const { partyId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const socket = socketClient.socket;
  const [currentUser, setCurrentUser] = useState<User>(
    JSON.parse(localStorage.getItem("user") || "{}") || {}
  );

  const queryClient = useQueryClient();
  const { data: party, status } = useQuery<
    PartyInterface,
    Response,
    PartyInterface
  >(
    ["party", partyId],
    () =>
      getPartyById(partyId as string).then((result) => {
        if (!socketClient.connected) {
          socketClient.connect(partyId as string, eventHandler);
        }
        return Promise.resolve(result);
      }),
    {
      retry: false,
      enabled: !!partyId,
    }
  );

  const eventHandler = useCallback(
    (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "error") {
          console.error(data.message);
          return;
        }
        queryClient.setQueryData(["party", partyId], data);
      } catch (err) {
        console.error(err);
      }
    },
    [partyId, queryClient]
  );

  useEffect(() => {
    if (!user && pathname) {
      navigate(`/login?returnPath=${pathname}`);
    }
  }, [navigate, pathname, user]);

  useLogout({ queryKey: ["party", partyId] });

  if (status === "loading") {
    return (
      <HeroLayout>
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      </HeroLayout>
    );
  }

  if (!party || !partyId || status === "error") {
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

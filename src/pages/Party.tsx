import { useCallback, useEffect, useRef, useState } from "react";
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
import { Navbar } from "../containers/Navbar";
import { useQuery, useQueryClient } from "react-query";
import { useUser } from "../contexts/UserContext";
import { PartyInterface } from "../types/party";
import { useLogout } from "../hooks/useLogout";
import { EventResponseDTO, PartyEvents } from "../types/events";
import { useNotifications } from "../contexts/NotificationContext";
import { CopyButton } from "../containers/CopyButton";

const EVENTS_SHOULD_NOTIFY: PartyEvents[] = [
  "add user",
  "remove user",
  "add item",
  "remove item",
];

const mapEventToText: Partial<
  Record<typeof EVENTS_SHOULD_NOTIFY[number], string>
> = {
  "add user": "User added",
  "remove user": "User left",
  "add item": "added",
  "remove item": "removed",
};
const socket = socketClient.socket;

export const Party = () => {
  const { partyId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { addAlert } = useNotifications();
  const shouldNotify = useRef<boolean>(false);

  const [socketState, setSocketState] = useState<number>(socket.readyState);
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
          socketClient.connect(partyId as string, eventHandler, setSocketState);
        }
        return Promise.resolve(result);
      }),
    {
      retry: false,
      enabled: !!partyId,
      onError: (err) => {
        if (err.status === 401) {
          setUser(null);
        }
      },
    }
  );

  const eventHandler = useCallback(
    (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as EventResponseDTO;
        if (data.type === "error") {
          addAlert({ mode: "danger", text: data.message });
          return;
        }
        if (EVENTS_SHOULD_NOTIFY.includes(data.type)) {
          if (!data.eventData?.itemName) {
            addAlert({
              mode: "info",
              text: `${mapEventToText[data.type]}: ${data.eventData?.userName}`,
            });
          } else {
            addAlert({
              mode: "info",
              text: `${data.eventData?.userName} ${mapEventToText[data.type]} ${
                data.eventData?.itemName
              }`,
            });
          }
        }
        queryClient.setQueryData(["party", partyId], data.party);
      } catch (err) {
        console.error(err);
      }
    },
    [addAlert, partyId, queryClient]
  );

  useEffect(() => {
    if (!user && pathname) {
      navigate(`/login?returnPath=${pathname}`);
    }
  }, [navigate, pathname, user]);

  useEffect(() => {
    if (socketState === 3) {
      addAlert({
        mode: "danger",
        text: "Connection is lost",
      });
      shouldNotify.current = true;

      socketClient.reConnect(partyId as string, eventHandler, setSocketState);
    }
    if (socketState === 1 && shouldNotify.current) {
      addAlert({
        mode: "success",
        text: `Connected to ${party?.name}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addAlert, socketState]);

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

  if (!socket || socketState === 2 || socketClient.error) {
    return (
      <HeroLayout>
        <div>
          <p className="title">Ooops! Something went wrong</p>
          <p className="subtitle is-flex is-align-items-baseline">
            No connection{" "}
            <button
              onClick={() =>
                socketClient.reConnect(partyId, eventHandler, setSocketState)
              }
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
        Navbar={<Navbar />}
        Header={
          <Header>
            <h2 className="title">
              <CopyButton
                title={`${
                  currentUser.name ? `Hello, ${currentUser.name}` : "Hello"
                }! Welcome to ${party?.name}`}
              />
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

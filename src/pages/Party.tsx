import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Aside, Columns, Header, Main } from "../components";
import { HeroLayout } from "../layouts/heroLayout";
import { PlainLayout } from "../layouts/plain";
import { getPartyById } from "../__api__/parties";
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
import { Transport } from "../services/transport";
import { SOCKET_STATE } from "../services/constants";
import { sortPartyUsers } from "../utils/sort";

const EVENTS_SHOULD_NOTIFY: PartyEvents[] = [
  "add user",
  "remove user",
  "add item",
  "remove item",
  "confirm guest addition",
];

const mapEventToText: Partial<
  Record<(typeof EVENTS_SHOULD_NOTIFY)[number], string>
> = {
  "add user": "User added",
  "remove user": "User left",
  "add item": "added",
  "remove item": "removed",
  "confirm guest addition": "Allow this user to join your party",
};

export const Party = () => {
  const { partyId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { addAlert } = useNotifications();

  const [socketState, setSocketState] = useState<number>();
  const [currentUser, setCurrentUser] = useState<User>(
    JSON.parse(localStorage.getItem("user") || "{}") || {}
  );

  const queryClient = useQueryClient();
  const {
    data: party,
    status,
    refetch,
    error,
  } = useQuery<PartyInterface, Response, PartyInterface>(
    ["party", partyId, user],
    () =>
      getPartyById(partyId as string).then((result) => {
        setSocketState(SOCKET_STATE.connecting);
        if (!Transport.transport) {
          Transport.createTransport(
            eventHandler,
            setSocketState,
            partyId as string
          );
        }
        const party = sortPartyUsers(result, user?.id || "");
        return Promise.resolve(party as PartyInterface);
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
  const isNoUser = error?.status === 403;

  const eventHandler = useCallback(
    (data: EventResponseDTO) => {
      try {
        if (data.type === "error") {
          addAlert({ mode: "danger", text: data.message });
          return;
        }
        if (data.type === "connect") {
          refetch();
          addAlert({
            mode: "success",
            text: `Connected to ${party?.name}`,
          });
          return;
        }
        if (data.type === "change state") {
          setSocketState(Number(data.message));
          if (Number(data.message) !== SOCKET_STATE.open) {
            addAlert({
              mode: "danger",
              text: "Connection is lost",
            });
          }
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
        const processedData = sortPartyUsers(data.party, user?.id || "");
        queryClient.setQueryData(["party", partyId, user], processedData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    [addAlert, party?.name, partyId, queryClient, refetch, user]
  );

  useEffect(() => {
    if (!user && pathname) {
      navigate(`/login?returnPath=${pathname}`);
    }
  }, [navigate, pathname, user]);

  useLogout({ queryKey: ["party", partyId, user] });

  if (status === "loading" || socketState === SOCKET_STATE.connecting) {
    return (
      <HeroLayout>
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      </HeroLayout>
    );
  }

  const onJoiningParty = (user: User) => {
    setCurrentUser(user);
    refetch();
  };

  if (isNoUser) {
    return (
      <HeroLayout>
        <h2 className="title is-2 my-5">Joining the party</h2>
        <Columns>
          <div>
            <JoinPartyForm onSuccess={onJoiningParty} />
          </div>
          <div />
        </Columns>
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

  if (socketState !== SOCKET_STATE.open) {
    return (
      <HeroLayout>
        <div>
          <p className="title">Ooops! Something went wrong</p>
          <p className="subtitle is-flex is-align-items-baseline">
            No connection{" "}
            <button
              onClick={() => Transport.connect(partyId as string)}
              className="button ml-2"
            >
              re-connect
            </button>
          </p>
        </div>
      </HeroLayout>
    );
  }

  const renderMain = () => {
    return (
      <>
        <MainFormView
          UserView={({ user }) => (
            <UserPartyForm party={party} user={user || currentUser} />
          )}
          PartyView={() => <PartyView party={party} user={currentUser} />}
        />
        <AddItemForm />
      </>
    );
  };

  return (
    <PartySettingsProvider isOnline={socketState === SOCKET_STATE.open}>
      <PlainLayout
        Navbar={<Navbar navbarProps={{ hasShadow: true, isFixed: true }} />}
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

export default Party;

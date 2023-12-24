import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import uuid from "uuidv4";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useUser } from "../contexts/UserContext";
import { PartyInterface } from "../types/party";
import { useLogout } from "../hooks/useLogout";
import { EventResponseDTO, PartyEvents } from "../types/events";
import {
  useNotifications,
  Notification,
} from "../contexts/NotificationContext";
import { CopyButton } from "../containers/CopyButton";
import { Transport } from "../services/transport";
import { SOCKET_STATE } from "../services/constants";
import { sortPartyUsers } from "../utils/sort";
import { usePrompts } from "../contexts/PromptContext";
import { CreateUserDTO, createUser } from "../__api__/users";
import { ErrorRequest } from "../__api__/helpers";
import { GUEST_KEY } from "../containers/JoinPartyForm/JoinPartyForm";
import { useTranslation } from "react-i18next";
import i18n from "../services/i18next";

const EVENTS_SHOULD_NOTIFY: PartyEvents[] = [
  "add user",
  "remove user",
  "add item",
  "remove item",
];

const mapEventToText: Partial<
  Record<(typeof EVENTS_SHOULD_NOTIFY)[number], string>
> = {
  "add user": "ALERT_INFO_USER_ADDED",
  "remove user": "ALERT_INFO_USER_LEFT",
  "add item": "ALERT_INFO_ITEM_ADDED",
  "remove item": "ALERT_INFO_ITEM_REMOVED",
};

const CONNECTION_ERROR_PROMPT_ID = "no_socket_connection";

const getAlertData = (event: EventResponseDTO): Notification | null => {
  if (event.type === "error") {
    return { text: event.message, mode: "danger" };
  }
  if (EVENTS_SHOULD_NOTIFY.includes(event.type)) {
    if (!event.eventData?.itemName) {
      return {
        mode: "info",
        text: i18n.t(mapEventToText[event.type] as string, {
          name: event.eventData?.userName,
        }),
      };
    } else {
      return {
        mode: "info",
        text: i18n.t(mapEventToText[event.type] as string, {
          name: event.eventData?.userName,
          item: event.eventData?.itemName,
        }),
      };
    }
  }
  return null;
};

export const Party = () => {
  const { partyId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { addAlert } = useNotifications();
  const { addPrompt, removePrompt } = usePrompts();

  const [socketState, setSocketState] = useState<number>();
  const [currentUser, setCurrentUser] = useState<User>(
    JSON.parse(localStorage.getItem("user") ?? "{}") || {}
  );
  const { t } = useTranslation();

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
        if (window.localStorage.getItem(GUEST_KEY)) {
          window.localStorage.removeItem(GUEST_KEY);
        }
        const party = sortPartyUsers(result, user?.id ?? "");
        return Promise.resolve(party);
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
  const { mutate: mutateUser } = useMutation<
    User,
    ErrorRequest,
    CreateUserDTO,
    unknown
  >(createUser, {
    onError: async (error) => {
      if (error.status === 401) {
        setUser(null);
      }
      if (error) {
        addAlert({ mode: "danger", text: "Ooops..." });
      }
    },
  });

  const eventHandler = useCallback(
    (data: EventResponseDTO) => {
      try {
        if (data.type === "connect") {
          refetch().then(
            () =>
              addAlert({
                mode: "success",
                text: t("ALERT_INFO_CONNECTED_TO", { party: party?.name }),
              }),
            () =>
              addAlert({
                mode: "danger",
                text: t("ALERT_ERROR_UNABLE_TO_CONNECT"),
              })
          );
          return;
        }
        if (data.type === "change state") {
          setSocketState(Number(data.message));
          if (Number(data.message) !== SOCKET_STATE.open) {
            addAlert({
              mode: "danger",
              text: t("ALERT_ERROR_UNABLE_TO_CONNECT"),
            });
          }
          return;
        }
        if (data.type === "confirm guest addition") {
          const id = uuid();

          addPrompt({
            title: t("PROMPT_USER_JOINING", { name: data.eventData?.userName }),
            text: t("PROMPT_USER_JOINING_TEXT"),
            confirmLabel: t("PROMPT_USER_JOINING_BUTTON_CONFIRM"),
            id,
            onConfirm: () => {
              removePrompt(id);
              data.eventData?.userId &&
                mutateUser({
                  userId: data.eventData.userId,
                  partyId: partyId as string,
                });
            },
            onCancel: () => {
              data.eventData?.userId &&
                Transport.sendEvent({
                  type: "reject guest addition",
                  currentUser: user?.id as string,
                  partyId: partyId as string,
                  userId: data.eventData?.userId,
                });
              removePrompt(id);
            },
            cancelLabel: t("PROMPT_USER_JOINING_BUTTON_REJECT"),
          });
        }
        const alertData = getAlertData(data);
        if (alertData) {
          addAlert(alertData);
        }
        const processedData = sortPartyUsers(data.party, user?.id ?? "");
        queryClient.setQueryData(["party", partyId, user], processedData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    [
      addAlert,
      addPrompt,
      mutateUser,
      party?.name,
      partyId,
      queryClient,
      refetch,
      removePrompt,
      user,
      t,
    ]
  );

  useEffect(() => {
    if (!user && pathname) {
      navigate(`/login?returnPath=${pathname}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user]);

  useLogout({ queryKey: ["party", partyId, user] });

  const isReadOnly = socketState !== SOCKET_STATE.open;

  useEffect(() => {
    if (status === "loading" || socketState === SOCKET_STATE.connecting) {
      removePrompt(CONNECTION_ERROR_PROMPT_ID);
      return;
    }

    if (socketState === SOCKET_STATE.closed) {
      addPrompt({
        title: t("ERROR_DEFAULT_TITLE"),
        text: t("ERROR_NO_CONNECTION"),
        confirmLabel: t("BUTTON_RECONNECT"),
        id: CONNECTION_ERROR_PROMPT_ID,
        onConfirm: () => {
          partyId && Transport.connect(partyId);
        },
      });
    } else {
      removePrompt(CONNECTION_ERROR_PROMPT_ID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketState, status, isReadOnly, partyId]);

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
        <h2 className="title is-2 my-5">{t("TITLE_JOINING_PARTY")}</h2>
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
          <p className="title">{t("TITLE_NO_PARTY")}</p>
          <p className="subtitle is-flex is-align-items-baseline">
            {t("ERROR_SUBTITLE_NO_PARTY")}
            <a className="button ml-2" href="/">
              {t("LINK_HOME")}
            </a>
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
            <UserPartyForm
              isReadOnly={isReadOnly}
              party={party}
              user={user ?? currentUser}
            />
          )}
          PartyView={() => (
            <PartyView
              isReadOnly={isReadOnly}
              party={party}
              user={currentUser}
            />
          )}
        />
        <AddItemForm isReadOnly={isReadOnly} />
      </>
    );
  };

  return (
    <PartySettingsProvider isOnline={socketState === SOCKET_STATE.open}>
      <PlainLayout
        Header={
          <Header>
            <h2 className="title">
              <CopyButton
                title={t("TITLE_WELCOME_TO_PARTY", {
                  name: currentUser.name ? `, ${currentUser.name}` : "",
                  party: party?.name,
                })}
              />
            </h2>
          </Header>
        }
        Main={<Main>{renderMain()}</Main>}
        Aside={
          !isNoUser &&
          !isReadOnly && (
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

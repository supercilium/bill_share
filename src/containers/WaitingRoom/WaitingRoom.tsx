import { FC } from "react";
import { useQuery } from "react-query";
import { checkPartyConfirmed } from "../../__api__/parties";
import { Loader } from "../../components/Loader";
import { ErrorRequest } from "../../__api__/helpers";
import { useNavigate } from "react-router";
import { GUEST_KEY } from "../JoinPartyForm/JoinPartyForm";
import { useTranslation } from "react-i18next";

interface WaitingRoomProps {
  userId: string;
  partyId: string;
  onSuccess: () => void;
}

interface CheckPartyConfirmedResponse {
  success: boolean;
}

export const WaitingRoom: FC<WaitingRoomProps> = ({
  userId,
  partyId,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const guestQuery = useQuery<
    CheckPartyConfirmedResponse,
    ErrorRequest,
    CheckPartyConfirmedResponse
  >(
    ["confirm-quest", userId, partyId],
    () =>
      checkPartyConfirmed({
        id: userId,
        partyId: partyId,
      }),
    {
      refetchInterval: (data, query) => {
        if (query.state.error?.status === 400) {
          return false;
        }
        return !data?.success ? 1000 : false;
      },
      onSuccess: (data) => {
        if (data.success) {
          onSuccess();
        }
      },
      onError: (error) => {
        if (error.status === 400) {
          window.localStorage.removeItem(GUEST_KEY);
        }
      },
      enabled: Boolean(partyId && userId),
    }
  );

  return (
    <div>
      {!guestQuery.isSuccess && (
        <p className="is-5 mb-5">{t("TITLE_WAITING_ROOM")}</p>
      )}
      {guestQuery.isLoading && (
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      )}
      {guestQuery.isSuccess && guestQuery.data?.success && (
        <>
          <p className="is-5 mb-5">{t("USER_ALLOWED")}</p>
          <button
            className="button is-primary"
            onClick={() => navigate(`/party/${partyId}`)}
          >
            {t("BUTTON_JOIN_PARTY")}
          </button>
        </>
      )}
      {guestQuery.isError && (
        <>
          <p className="is-5 mb-5">{guestQuery.error?.message}</p>
          <button className="button is-primary" onClick={() => navigate("/")}>
            {t("LINK_HOMEPAGE")}
          </button>
        </>
      )}
    </div>
  );
};

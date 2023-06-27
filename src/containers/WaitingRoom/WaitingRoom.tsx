import { FC } from "react";
import { useQuery } from "react-query";
import { checkPartyConfirmed } from "../../__api__/parties";
import { Loader } from "../../components/Loader";
import { ErrorRequest } from "../../__api__/helpers";
import { useNavigate } from "react-router";
import { GUEST_KEY } from "../JoinPartyForm/JoinPartyForm";

interface WaitingRoomProps {
  userId: string;
  partyId: string;
}

interface CheckPartyConfirmedResponse {
  success: boolean;
}

export const WaitingRoom: FC<WaitingRoomProps> = ({ userId, partyId }) => {
  const navigate = useNavigate();

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
        return !data?.success || query.state.error?.status === 400
          ? 10000
          : false;
      },
      onSuccess: (data) => {
        if (data.success) {
          navigate(`/party/${partyId}`);
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
        <p className="is-5 mb-5">Wait until someone confirms your request</p>
      )}
      {guestQuery.isLoading && (
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      )}
      {guestQuery.isSuccess && guestQuery.data?.success && (
        <>
          <p className="is-5 mb-5">
            You are confirmed. You will be redirected to the party in a couple
            of seconds, or you can join by clicking the button
          </p>
          <button
            className="button is-primary"
            onClick={() => navigate(`/party/${partyId}`)}
          >
            Join the party
          </button>
        </>
      )}
      {guestQuery.isError && (
        <>
          <p className="is-5 mb-5">{guestQuery.error?.message}</p>
          <button className="button is-primary" onClick={() => navigate("/")}>
            Go to homepage
          </button>
        </>
      )}
    </div>
  );
};

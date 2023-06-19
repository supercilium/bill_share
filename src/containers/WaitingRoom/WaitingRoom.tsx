import { FC } from "react";
import { useQuery } from "react-query";
import { checkPartyConfirmed } from "../../__api__/parties";
import { Loader } from "../../components/Loader";
import { ErrorRequest } from "../../__api__/helpers";
import { useNavigate } from "react-router";

interface WaitingRoomProps {
  userId: string;
  partyId: string;
}

export const WaitingRoom: FC<WaitingRoomProps> = ({ userId, partyId }) => {
  const navigate = useNavigate();

  const query = useQuery<{ success: boolean }, ErrorRequest>(
    ["confirm-quest", userId, partyId],
    () =>
      checkPartyConfirmed({
        id: userId,
        partyId: partyId,
      }),
    {
      refetchInterval: (data) => {
        return !data?.success ? 10000 : false;
      },
      onSuccess: (data) => {
        if (data.success) {
          navigate(`/party/${partyId}`);
        }
      },
      enabled: Boolean(partyId && userId),
    }
  );

  return (
    <div>
      <p className="is-5 mb-5">Wait until someone confirm your request</p>
      {query.status !== "success" && (
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

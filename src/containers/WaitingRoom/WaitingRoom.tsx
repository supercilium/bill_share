import { FC } from "react";
import { useQuery } from "react-query";
import { checkPartyConfirmed } from "../../__api__/parties";
import { Loader } from "../../components/Loader";
import { ErrorRequest } from "../../__api__/helpers";

interface WaitingRoomProps {
  userId: string;
  partyId: string;
}

export const WaitingRoom: FC<WaitingRoomProps> = ({ userId, partyId }) => {
  const query = useQuery<{ success: boolean }, ErrorRequest>(
    ["confirm-quest", userId, partyId],
    () =>
      checkPartyConfirmed({
        id: userId as string,
        partyId: partyId as string,
      }),
    {
      refetchInterval: (data) => {
        return !data || !data?.success ? 10000 : false;
      },
      enabled: Boolean(partyId && userId),
    }
  );

  return (
    <div>
      <p>Wait until someone confirm your joining</p>
      {query.status !== "success" && (
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

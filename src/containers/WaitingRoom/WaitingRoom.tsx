import { FC } from "react";
import { useQuery } from "react-query";
import { checkPartyConfirmed } from "../../__api__/parties";
import { Loader } from "../../components/Loader";

interface WaitingRoomProps {
  userId: string;
  partyId: string;
}

export const WaitingRoom: FC<WaitingRoomProps> = ({ userId, partyId }) => {
  const query = useQuery<Response, Response, Response>(
    ["confirm-quest", userId, partyId],
    () =>
      checkPartyConfirmed({
        id: userId as string,
        partyId: partyId as string,
      }),
    {
      refetchInterval: (data?: Response) =>
        !data || data.status !== 200 ? 5000 : false,
      enabled: Boolean(partyId && userId),
    }
  );
  return (
    <div>
      {query.status === "loading" && (
        <div className="is-flex container is-align-items-center is-flex-direction-column is-justify-content-center">
          <Loader />
        </div>
      )}
      {query.error && <p>error</p>}
    </div>
  );
};

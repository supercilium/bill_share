import { FC, useState } from "react";
import { useQuery } from "react-query";
import { Loader } from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { PartiesListDTO } from "../../types/party";
import { getParties } from "../../__api__/party";

interface PartiesListProps {}

const PAGE_SIZE = 10;

export const PartiesList: FC<PartiesListProps> = (props) => {
  const [page, setPage] = useState(0);
  const { user } = useUser();
  const userId = user?.id;

  const { data, status } = useQuery<PartiesListDTO, Response, PartiesListDTO>(
    ["parties", userId, page],
    () =>
      getParties({
        userId: userId as string,
        start: "" + page * PAGE_SIZE,
        size: "" + PAGE_SIZE,
      }),
    {
      retry: false,
      enabled: !!userId,
    }
  );

  if (!data || status !== "success") {
    return <Loader />;
  }

  const { amount, data: parties } = data;

  const pages = Math.ceil(amount / PAGE_SIZE);

  return (
    <div>
      <div>
        {parties?.length > 0 &&
          parties.map((party) => (
            <a href={`/party/${party.id}`}>{party.name}</a>
          ))}
      </div>
      <div>pagination mock</div>
      <div>
        {pages > 1 &&
          new Array(pages).fill(1).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`button${page === i ? " primary" : ""}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
      </div>
    </div>
  );
};

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Block } from "../../components";
import { Loader } from "../../components/Loader";
import { Pagination } from "../../components/Pagination";
import { useUser } from "../../contexts/UserContext";
import { PartiesListDTO } from "../../types/party";
import { getParties } from "../../__api__/party";

interface PartiesListProps {}

const PAGE_SIZE = 10;

export const PartiesList: FC<PartiesListProps> = (props) => {
  const [page, setPage] = useState(0);
  const { user, setUser } = useUser();
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
      onError: (err) => {
        if (err.status === 401) {
          setUser(null);
        }
      },
    }
  );

  if (status === "loading") {
    return <Loader />;
  }

  if (!data) return null;

  const { amount, data: parties } = data;

  const pages = Math.ceil(amount / PAGE_SIZE);

  return (
    <div className="box">
      <Block title="Your parties">
        <div>
          {parties?.length > 0 &&
            parties.map((party) => (
              <div>
                <Link to={`/party/${party.id}`}>
                  {party.isOwner && (
                    <i>
                      <FontAwesomeIcon
                        className="mr-2"
                        icon="crown"
                        size="2xs"
                        title="You are the master of the party"
                      />
                    </i>
                  )}
                  {party.name}
                </Link>
              </div>
            ))}
        </div>
      </Block>
      <div>
        {pages > 1 && (
          <Pagination
            size={pages}
            activePage={page + 1}
            onChangePage={(value) => {
              setPage(value - 1);
            }}
          />
        )}
      </div>
    </div>
  );
};

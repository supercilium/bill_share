import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, MouseEvent, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { Pagination } from "../../components/Pagination";
import { useNotifications } from "../../contexts/NotificationContext";
import { useUser } from "../../contexts/UserContext";
import { PartiesListDTO } from "../../types/party";
import { ErrorRequest } from "../../__api__/helpers";
import { deleteParty, getParties } from "../../__api__/parties";
import "./PartiesList.scss";
import { useTranslation } from "react-i18next";

interface PartiesListProps {}

const PAGE_SIZE = 10;

export const PartiesList: FC<PartiesListProps> = (props) => {
  const [page, setPage] = useState(0);
  const { user, setUser } = useUser();
  const userId = user?.id;
  const { addAlert } = useNotifications();
  const { t } = useTranslation();

  const { data, status, refetch } = useQuery<
    PartiesListDTO,
    Response,
    PartiesListDTO
  >(
    ["parties", userId, page],
    () =>
      getParties({
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
  const { mutate, isLoading } = useMutation<void, ErrorRequest, string, void>(
    deleteParty,
    {
      onSuccess: () => {
        refetch();
      },
      onError: async (error) => {
        if (error.status === 401) {
          setUser(null);
        }
        if (error) {
          addAlert({
            mode: "danger",
            text: t("ALERT_PARTY_DELETION_ERROR"),
          });
        }
      },
    }
  );

  const handleRemoveParty = async (id: string) => {
    mutate(id);
  };

  const { amount, data: parties } = data || {};

  const pages = amount ? Math.ceil(amount / PAGE_SIZE) : 1;

  return (
    <div className="panel styled-panel has-background-white">
      <p className="panel-heading">{t("TITLE_PARTIES")}</p>
      {(status === "loading" || isLoading) && (
        <div className="panel-block middle-row is-justify-content-center">
          <Loader />
        </div>
      )}
      {status !== "loading" && !parties?.length && (
        <div className="panel-block middle-row is-justify-content-center has-text-grey-light">
          {t("NO_PARTIES")}
        </div>
      )}

      {status === "success" &&
        (parties || [])?.length > 0 &&
        parties?.map((party) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <div className="panel-block" key={party.id}>
            <i className="panel-icon">
              {party.isOwner && (
                <FontAwesomeIcon
                  className="mr-2"
                  icon="crown"
                  size="2xs"
                  title={t("PARTY_MASTER_HOVER")}
                />
              )}
            </i>
            <Link className="is-flex-grow-1" to={`/party/${party.id}`}>
              {party.name}
            </Link>
            {party.isOwner && (
              <button
                type="button"
                className="delete is-flex-grow-0"
                title="Delete party"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleRemoveParty(party.id);
                }}
              />
            )}
          </div>
        ))}
      <div className="panel-block pagination-block is-block">
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

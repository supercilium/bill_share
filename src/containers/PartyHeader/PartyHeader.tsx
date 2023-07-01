import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import cx from "classnames";
import { useFormContext } from "react-hook-form";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { useUISettings } from "../../contexts/UIsettings";
import { PartyInterface } from "../../types/party";
import "./PartyHeader.scss";

export const PartyHeader: FC<{
  users: PartyInterface["users"];
  master: PartyInterface["owner"];
}> = ({ users, master }) => {
  const { watch, setValue } = useFormContext<FormSettings>();
  const { setAsideVisibility } = useUISettings();
  const partySettings = watch();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};
  const sortedUsers = [
    currentUser,
    ...Object.values(users).filter((user) => user.id !== currentUser.id),
  ];

  return (
    <div className="is-flex">
      <button
        className="button mr-3 is-flex-shrink-0"
        onClick={() => setAsideVisibility(true)}
      >
        <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon="sliders" />
          </span>
          <span className="ml-1 is-hidden-mobile">Bill config</span>
        </span>
      </button>
      <div className="styled-tabs">
        <div className="tabs">
          <ul>
            <li
              key="very-first"
              className={`styled-tab${
                partySettings.view === "party" ? " is-active" : ""
              }`}
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                title="Back to party view"
                onClick={() => {
                  setValue("view", "party");
                  setValue("user", undefined);
                }}
              >
                <span className="icon-text">
                  <span className="icon mr-1">
                    <FontAwesomeIcon icon="people-group" />
                  </span>
                  <span>All</span>
                </span>
              </a>
            </li>
            {sortedUsers.map((one) => {
              return (
                <li
                  className={cx("is-flex styled-tab", {
                    "is-active": one.id === partySettings?.user?.id,
                  })}
                  key={one.id}
                >
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    className="is-relative"
                    onClick={() => {
                      setValue("view", "user");
                      setValue("user", one);
                    }}
                  >
                    <span className="icon-text">
                      {one.id === master.id && (
                        <span className="icon mr-1">
                          <FontAwesomeIcon icon="crown" />
                        </span>
                      )}
                      <span>{one.name}</span>
                      {/* TODO add to all users when their status comes from BE */}
                      {currentUser.id === one.id && (
                        <span
                          className={cx(
                            "status-dot is-size-3",
                            `has-text-${partySettings ? "success" : "gray"}`
                          )}
                        >
                          •
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

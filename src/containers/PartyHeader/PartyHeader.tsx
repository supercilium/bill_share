import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { useUISettings } from "../../contexts/UIsettings";
import { PartyInterface } from "../../types/party";
import { StatusDot, StyledTab, StyledTabs } from "./PartyHeader.styles";

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
    ...users.filter((user) => user.id !== currentUser.id),
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
      <StyledTabs>
        <div className="tabs">
          <ul>
            <StyledTab
              key="very-first"
              className={partySettings.view === "party" ? "is-active" : ""}
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
            </StyledTab>
            {sortedUsers.map((one) => {
              return (
                <StyledTab
                  className={`is-flex ${
                    one.id === partySettings?.user?.id ? "is-active" : ""
                  }`}
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
                        <StatusDot
                          className={`is-size-3 ${
                            partySettings ? "has-text-success" : "has-text-gray"
                          }`}
                        >
                          •
                        </StatusDot>
                      )}
                    </span>
                  </a>
                </StyledTab>
              );
            })}
          </ul>
        </div>
      </StyledTabs>
    </div>
  );
};

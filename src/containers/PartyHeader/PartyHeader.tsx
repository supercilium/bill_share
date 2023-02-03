import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { useUISettings } from "../../contexts/UIsettings";
import { PartyInterface } from "../../types/party";
import { StyledTab, StyledTabs } from "./PartyHeader.styles";

export const PartyHeader: FC<{ users: PartyInterface["users"] }> = ({
  users,
}) => {
  const { watch, setValue } = useFormContext<FormSettings>();
  const { setAsideVisibility } = useUISettings();
  const partySettings = watch();

  return (
    <div className="is-flex">
      <button
        className="button mr-3 is-flex-shrink-0"
        onClick={() => setAsideVisibility(true)}
      >
        <span className="icon-text">
          <span className="icon mr-1">
            <FontAwesomeIcon icon="sliders" />
          </span>
          <span>Settings</span>
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
            {users.map((one) => (
              <StyledTab
                className={`is-flex ${
                  one.id === partySettings?.user?.id ? "is-active" : ""
                }`}
                key={one.id}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  onClick={() => {
                    setValue("view", "user");
                    setValue("user", one);
                  }}
                >
                  {one.name}
                </a>
              </StyledTab>
            ))}
          </ul>
        </div>
      </StyledTabs>
    </div>
  );
};

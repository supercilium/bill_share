import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Columns } from "../components";
import { FormSettings } from "../contexts/PartySettingsContext";
import { PartyInterface } from "../types/party";

export const PartyHeader: FC<{ users: PartyInterface["users"] }> = ({
  users,
}) => {
  const { watch, setValue } = useFormContext<FormSettings>();
  const partySettings = watch();
  return (
    <Columns>
      <div className="tabs">
        <ul>
          <li
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
              <FontAwesomeIcon icon="people-group" />
            </a>
          </li>
          {users.map((one) => (
            <li
              className={one.id === partySettings?.user?.id ? "is-active" : ""}
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
            </li>
          ))}
        </ul>
      </div>
      <div />
    </Columns>
  );
};

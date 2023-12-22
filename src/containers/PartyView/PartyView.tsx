import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Block } from "../../components";
import { FormSettings } from "../../contexts/PartySettingsContext";
import { PartyInterface } from "../../types/party";
import { User } from "../../types/user";
import { PartyForm } from "../PartyForm";
import { PartyHeader } from "../PartyHeader";
import { PartyTotals } from "../PartyTotals";

interface PartyViewProps {
  party: PartyInterface;
  user: User;
  isReadOnly?: boolean;
}

export const PartyView: FC<PartyViewProps> = ({
  party,
  user,
  isReadOnly = true,
}) => {
  const { watch } = useFormContext<FormSettings>();
  const partySettings = watch();
  return (
    <Block
      title={
        <PartyHeader
          isReadOnly={isReadOnly}
          users={party.users}
          master={party.owner}
        />
      }
    >
      <div className="is-translated">
        <div className="with-scroll-horizontal box">
          <PartyForm isReadOnly={isReadOnly} party={party} currentUser={user} />
          <PartyTotals
            partySettings={partySettings}
            party={party}
            currentUser={user}
          />
        </div>
      </div>
    </Block>
  );
};

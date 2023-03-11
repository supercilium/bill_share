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
}

export const PartyView: FC<PartyViewProps> = ({ party, user }) => {
  const { watch } = useFormContext<FormSettings>();
  const partySettings = watch();
  return (
    <Block title={<PartyHeader users={party.users} master={party.owner} />}>
      <div className="is-translated">
        <div className="with-scroll-horizontal box">
          <PartyForm party={party} currentUser={user} />
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

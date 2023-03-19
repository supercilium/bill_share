import { FC } from "react";
import { Block } from "../../components";
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
  return (
    <Block title={<PartyHeader users={party.users} master={party.owner} />}>
      <div className="is-translated">
        <div className="with-scroll-horizontal box">
          <PartyForm party={party} currentUser={user} />
          <PartyTotals party={party} currentUser={user} />
        </div>
      </div>
    </Block>
  );
};

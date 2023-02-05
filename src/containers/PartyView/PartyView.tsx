import { FC } from "react";
import { Block } from "../../components";
import { FormWrapper } from "../../components/styled/formWrapper";
import { PartyInterface } from "../../types/party";
import { User } from "../../types/user";
import { PartyForm } from "../PartyForm";
import { PartyHeader } from "../PartyHeader";
import { PartyTotals } from "../PartyTotals";
import { StyledPartyForm } from "./PartyView.styles";

interface PartyViewProps {
  party: PartyInterface;
  user: User;
}

export const PartyView: FC<PartyViewProps> = ({ party, user }) => {
  return (
    <Block title={<PartyHeader users={party.users} master={party.owner} />}>
      <FormWrapper>
        <StyledPartyForm className="box">
          <PartyForm party={party} currentUser={user} />
          <PartyTotals party={party} currentUser={user} />
        </StyledPartyForm>
      </FormWrapper>
    </Block>
  );
};

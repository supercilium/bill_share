import styled from "styled-components";
import { device } from "./constants";

export const AddUserLayout = styled.form`
  & button {
    margin-top: calc(24px + 0.5em);
  }

  @media ${device.tablet} {
    display: grid;
    grid-template-columns: 200px 100px;
    gap: 16px;
    align-items: flex-start;
  }
`;

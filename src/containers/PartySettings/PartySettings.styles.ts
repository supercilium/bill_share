import styled from "styled-components";
import { device } from "../../components/styled/constants";

export const SettingsRoot = styled.div`
  padding-bottom: 10rem;
  max-height: 100vh;
  overflow-y: auto;

  @media ${device.tablet} {
    padding-bottom: 5rem;
  }
`;

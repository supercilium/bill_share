import styled from "styled-components";
import { device } from "../../components/styled/constants";

export const StyledPartyForm = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none;
  width: 100%;
  scroll-snap-type: x mandatory;
  list-style-type: none;

  /* &::after {
    content: "";
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 35%,
      rgba(255, 255, 255, 1) 100%
    );
  }

  @media ${device.tablet} {
    &::after {
      display: none;
    }
  } */
`;

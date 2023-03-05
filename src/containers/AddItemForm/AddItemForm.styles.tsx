import styled from "styled-components";
import { device } from "../../components/styled/constants";

export const AddItemLayout = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0 16px;
  align-items: flex-start;

  @media ${device.tablet} {
    grid-template-columns: 200px 60px 100px 100px;
    grid-template-rows: none;
  }
`;

export const AddItemButton = styled.button`
  grid-column-start: 2;
  grid-column-end: 4;
  margin-top: calc(24px + 0.5em);

  @media ${device.tablet} {
    grid-column-start: auto;
    grid-column-end: auto;
  }
`;

export const WideTrack = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;

  @media ${device.tablet} {
    grid-column-start: auto;
    grid-column-end: auto;
  }
`;

import styled from "styled-components";
import { device } from "./constants";

export const AddItemLayout = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  align-items: flex-end;

  & > :first-child {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  & > :last-child {
    grid-column-start: 2;
    grid-column-end: 4;
  }

  @media ${device.tablet} {
    grid-template-columns: 200px 60px 70px 100px;
  }
`;

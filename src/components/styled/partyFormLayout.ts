import styled from "styled-components";

export const PartyFormLayout = styled.div<{
  amountOfUsers: number;
  isDiscountVisible: boolean;
  isEquallyVisible: boolean;
  isEqually: boolean;
}>`
  display: grid;
  grid-template-columns: 200px 60px 70px ${({
  isDiscountVisible,
  amountOfUsers,
  isEqually,
  isEquallyVisible,
}) =>
    `${isDiscountVisible ? "60px " : ""} ${isEquallyVisible ? "3rem " : ""
    }repeat(${amountOfUsers}, ${isEqually ? "2rem" : "60px"})`};
  gap: 16px;
  width: fit-content;
  padding-right: 60px;
`;

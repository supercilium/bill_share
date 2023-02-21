import styled from "styled-components";

export const PartyFormLayout = styled.div<{
  amountOfUsers: number;
  isDiscountVisible: boolean;
  isEquallyVisible: boolean;
}>`
  display: grid;
  grid-template-columns: 200px 60px 90px ${({
  isDiscountVisible,
  amountOfUsers,
  isEquallyVisible,
}) =>
    `${isDiscountVisible ? "85px " : ""} ${isEquallyVisible ? "70px " : ""
    }repeat(${amountOfUsers}, 60px)`};
  gap: 16px;
  width: fit-content;
  padding-right: 60px;
`;

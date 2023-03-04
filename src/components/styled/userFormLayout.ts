import styled from "styled-components";

export const UserFormLayout = styled.div<{
  isDiscountVisible: boolean;
  isEquallyVisible: boolean;
}>`
  display: grid;
  grid-template-columns: 200px 60px 90px ${({
      isDiscountVisible,
      isEquallyVisible,
    }) =>
      `${isDiscountVisible ? "85px " : ""}
    ${isEquallyVisible ? "3rem " : ""}70px`};
  gap: 16px;
  align-items: flex-start;
  width: fit-content;
  padding-right: 60px;
`;

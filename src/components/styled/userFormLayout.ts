import styled from "styled-components";

export const UserFormLayout = styled.div<{
  isDiscountVisible: boolean;
  isEquallyVisible: boolean;
}>`
  display: grid;
  grid-template-columns: 200px 60px 70px ${({
  isDiscountVisible,
  isEquallyVisible,
}) =>
    `${isDiscountVisible ? "60px " : ""}
    ${isEquallyVisible ? "3rem " : ""}70px`};
  gap: 16px;
  align-items: center;
  width: fit-content;
  padding-right: 60px;
  /* margin: 0.75rem 0; */
`;
